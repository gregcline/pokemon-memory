use console_log;
use log::info;
use sauron::prelude::*;

mod cards;

#[wasm_bindgen(start)]
pub fn main() {
    console_log::init().unwrap();
    Program::mount_to_body(cards::Cards::default());
}
