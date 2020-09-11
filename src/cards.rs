use log::info;
use rand::{
    distributions::{Distribution, Uniform},
    seq::SliceRandom,
    thread_rng, Rng,
};
use sauron::prelude::*;
use sauron::wasm_bindgen::JsCast;
use web_sys::window;

#[derive(Debug, PartialEq, Copy, Clone)]
pub enum State {
    FaceUp,
    FaceDown,
    Matched,
}

#[derive(Debug, PartialEq, Copy, Clone)]
pub struct Card {
    state: State,
    image_id: usize,
    index: usize,
}

impl Card {
    fn new(index: usize, image_id: usize) -> Self {
        Card {
            state: State::FaceDown,
            image_id,
            index,
        }
    }

    fn switch_state(&mut self) {
        self.state = match self.state {
            State::FaceDown => State::FaceUp,
            State::FaceUp => State::FaceDown,
            State::Matched => State::Matched,
        }
    }

    fn opacity(&self) -> &'static str {
        match self.state {
            State::FaceDown => "opacity-0",
            _ => "opacity-1",
        }
    }

    fn set_matched(&mut self) {
        self.state = State::Matched;
    }

    fn state(&self) -> State {
        self.state
    }

    fn view<MSG: 'static>(&self, msg: fn(usize) -> MSG) -> Node<MSG> {
        let index = self.index;
        div(
            vec![
                classes(["block", "rounded", "bg-gray-600"]),
                on_click(move |_| msg(index)),
            ],
            vec![
                self.view_matched(),
                img(
                    vec![
                        class("m-auto"),
                        class(self.opacity()),
                        src(format!("img/{}.png", self.image_id)),
                    ],
                    vec![],
                ),
            ],
        )
    }

    fn view_matched<MSG>(&self) -> Node<MSG> {
        if self.state == State::Matched {
            div(
                vec![classes(["text-grey-700", "absolute", "p-4"])],
                vec![text("✓")],
            )
        } else {
            div(vec![], vec![])
        }
    }
}

impl Default for Card {
    fn default() -> Self {
        Card::new(0, 1)
    }
}

#[derive(Debug, Copy, Clone, PartialEq)]
pub enum Msg {
    NoOp,
    Clicked(usize),
    UpdateSelected(Card),
    Deselect(Card, Card),
}

#[derive(Debug, PartialEq)]
enum Selected {
    None,
    One(Card),
}

#[derive(Debug)]
pub struct Cards {
    cards: Vec<Card>,
    selected: Selected,
}

impl Cards {
    fn update_selected(&mut self, card: &Card) {
        self.selected = match self.selected {
            Selected::None => Selected::One(*card),
            Selected::One(_) => Selected::None,
        }
    }
}

impl Default for Cards {
    fn default() -> Self {
        let dist = Uniform::from(1..152);
        let mut rng = thread_rng();
        let first_half: Vec<usize> = dist.sample_iter(rng).take(10).collect();
        let mut cards: Vec<&usize> = first_half.iter().chain(first_half.iter()).collect();
        cards.shuffle(&mut rng);

        Cards {
            cards: cards
                .iter()
                .enumerate()
                .map(|(index, &&id)| Card::new(index, id))
                .collect(),
            selected: Selected::None,
        }
    }
}

impl Component<Msg> for Cards {
    fn view(&self) -> Node<Msg> {
        div(
            vec![classes([
                "grid",
                "max-w-screen-lg",
                "max-h-screen-lg",
                "grid-cols-5",
                "grid-rows-4",
                "gap-2",
                "m-auto",
            ])],
            self.cards
                .iter()
                .map(|card: &Card| card.view(Msg::Clicked))
                .collect(),
        )
    }

    fn update(&mut self, msg: Msg) -> Cmd<Self, Msg> {
        info!("Got message in cards: {:?}", msg);
        let cmd = match msg {
            Msg::Clicked(index) => {
                if let Some(card) = self.cards.get_mut(index) {
                    card.switch_state();
                }

                let card = self.cards[index].clone();

                Cmd::new(move |program: Program<Self, Msg>| {
                    program.dispatch(Msg::UpdateSelected(card))
                })
            }
            Msg::UpdateSelected(card) => {
                let cmd = match self.selected {
                    Selected::One(card1) => {
                        if card1.image_id == card.image_id {
                            self.cards[card1.index].set_matched();
                            self.cards[card.index].set_matched();
                            Cmd::none()
                        } else {
                            Cmd::new(move |program| {
                                let timeout: Closure<dyn FnMut()> =
                                    Closure::wrap(Box::new(move || {
                                        program.dispatch(Msg::Deselect(card, card1));
                                    }));
                                window()
                                    .expect("Could not find window")
                                    .set_timeout_with_callback_and_timeout_and_arguments_0(
                                        timeout.as_ref().unchecked_ref(),
                                        1500,
                                    )
                                    .expect("Could not start timeout");
                                timeout.forget();
                            })
                        }
                    }
                    Selected::None => Cmd::none(),
                };
                self.update_selected(&card);

                cmd
            }
            Msg::Deselect(card1, card2) => {
                self.cards[card1.index].switch_state();
                self.cards[card2.index].switch_state();

                Cmd::none()
            }
            Msg::NoOp => Cmd::none(),
        };
        info!("New state: {:#?}", self.selected);

        cmd
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn opacity_is_zero_on_face_down_otherwise_1() {
        let mut card = Card::default();
        card.state = State::FaceDown;
        assert_eq!(card.opacity(), "opacity-0");
        card.state = State::FaceUp;
        assert_eq!(card.opacity(), "opacity-1");
        card.state = State::Matched;
        assert_eq!(card.opacity(), "opacity-1");
    }

    #[test]
    fn view_matched_shows_a_check_if_matched() {
        let mut card = Card::default();
        assert_eq!(card.view_matched::<Msg>(), div(vec![], vec![]));

        card.switch_state();
        assert_eq!(card.view_matched::<Msg>(), div(vec![], vec![]));

        card.set_matched();
        assert_eq!(
            card.view_matched::<Msg>(),
            div(
                vec![classes(["text-grey-700", "absolute", "p-4"])],
                vec![text("✓")]
            )
        );
    }

    #[test]
    fn switch_state() {
        let mut card = Card::default();
        assert_eq!(card.state, State::FaceDown);
        card.switch_state();
        assert_eq!(card.state, State::FaceUp);
        card.switch_state();
        assert_eq!(card.state, State::FaceDown);
        card.state = State::Matched;
        card.switch_state();
        assert_eq!(card.state, State::Matched);
    }

    #[test]
    fn update_selected() {
        let mut cards = Cards::default();
        assert_eq!(cards.selected, Selected::None);

        let card = Card::default();
        cards.update_selected(&card);
        assert_eq!(cards.selected, Selected::One(card));
    }

    #[test]
    fn set_matched() {
        let mut card = Card::default();
        assert_eq!(card.state, State::FaceDown);

        card.set_matched();
        assert_eq!(card.state, State::Matched);

        card.state = State::FaceUp;
        card.set_matched();
        assert_eq!(card.state, State::Matched);
    }
}
