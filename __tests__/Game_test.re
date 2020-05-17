open Jest;
open Expect;

describe("Game", () => {
    describe("nextPlayer", () => {
        test("returns Player1 for Player2", () => {
            let player = Game.Player2;
            expect(Game.nextPlayer(player)) |> toEqual(Game.Player1);
        });

        test("returns Player2 for Player1", () => {
            let player = Game.Player1;
            expect(Game.nextPlayer(player)) |> toEqual(Game.Player2);
        });
    });

    describe("showPlayer", () => {
        test("shows 'Player 1' for Player1", () => {
            expect(Game.showPlayer(Game.Player1)) |> toEqual("Player 1")
        });

        test("shows 'Player 2' for Player2", () => {
            expect(Game.showPlayer(Game.Player2)) |> toEqual("Player 2")
        });
    });
});
