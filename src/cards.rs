use rand::{seq::SliceRandom, thread_rng, Rng, distributions::{Distribution, Uniform}};
use sauron::prelude::*;
use log::info;

use crate::card::Card;

#[derive(Debug, Copy, Clone)]
pub enum Msg {
    NoOp,
    Clicked(usize),
    SetFaceUp,
    SetFaceDown,
    SetMatched,
}

pub struct Cards {
    cards: Vec<Card>
}

impl Default for Cards {
    fn default() -> Self {
        let dist = Uniform::from(1..152);
        let mut rng = thread_rng();
        let first_half: Vec<usize> = dist.sample_iter(rng)
            .take(10)
            .collect();
        let mut cards: Vec<&usize> = first_half.iter()
            .chain(first_half.iter())
            .collect();
        cards.shuffle(&mut rng);

        Cards {
            cards: cards.iter()
                .enumerate()
                .map(|(index, &&id)| Card::new(index, id))
                .collect()
        }
    }
}

impl Component<Msg> for Cards {
    fn view(&self) -> Node<Msg> {
        div(
            vec![classes(["grid", "max-w-screen-lg", "max-h-screen-lg", "grid-cols-5", "grid-rows-4", "gap-2", "m-auto"])],
            self.cards.iter().map(Card::view).collect(),
        )
    }

    fn update(&mut self, msg: Msg) -> Cmd<Self, Msg> {
        info!("Got message in cards: {:?}", msg);
        match msg {
            Msg::Clicked(index) => {
                self.cards
                    .iter_mut()
                    .for_each(|card: &mut Card| {
                        if card.index == index {
                            card.update(msg);
                        }
                    })
            }
            Msg::NoOp => (),
            _ => (),
        }
        Cmd::none()
    }
}
