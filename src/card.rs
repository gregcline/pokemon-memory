use sauron::prelude::*;
use log::info;

use crate::cards::Msg;

pub enum State {
    FaceUp,
    FaceDown,
    Matched,
}

pub struct Card {
    state: State,
    image_id: usize,
    pub index: usize,
}

impl Card {
    pub fn new(index: usize, image_id: usize) -> Self {
        Card {
            state: State::FaceDown,
            image_id,
            index,
        }
    }

    fn opacity(&self) -> &'static str {
        match self.state {
            State::FaceDown => "opacity-0",
            _ => "opacity-1"
        }
    }
}

impl Default for Card {
    fn default() -> Self {
        Card::new(0, 1)
    }
}

impl Component<Msg> for Card {
    fn view(&self) -> Node<Msg> {
        let index = self.index;
        div(
            vec![
                classes(["block", "rounded", "bg-gray-600"]),
                on_click(move |_| {
                    Msg::Clicked(index)
                }),
            ],
            vec![
                img(
                    vec![
                        class("m-auto"),
                        class(self.opacity()),
                        src(format!("img/{}.png", self.image_id)),
                    ],
                    vec![],
                )
            ]
        )
    }

    fn update(&mut self, msg: Msg) -> Cmd<Self, Msg> {
        info!("Got message in card: {:?}", msg);
        Cmd::none()
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
}
