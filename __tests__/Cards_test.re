open Jest;
open Expect;

describe("Cards", () => {
  describe("matches", () => {
    test("is true for two unmatched cards with the same id", () => {
      let card1 = {Cards.cardIndex: 0, imageId: 1, cardState: FaceUp};
      let card2 = {Cards.cardIndex: 1, imageId: 1, cardState: FaceUp};
      expect(Cards.matches(card1, card2)) |> toBe(true);
    });

    test("is false for two unmatched cards with different ids", () => {
      let card1 = {Cards.cardIndex: 0, imageId: 1, cardState: FaceUp};
      let card2 = {Cards.cardIndex: 1, imageId: 2, cardState: FaceUp};
      expect(Cards.matches(card1, card2)) |> toBe(false);
    });

    test("is false for a matched card with the same ids", () => {
      let card1 = {Cards.cardIndex: 0, imageId: 1, cardState: Matched};
      let card2 = {Cards.cardIndex: 1, imageId: 1, cardState: FaceUp};
      expect(Cards.matches(card2, card1)) |> toBe(false);
    });
  });

  describe("flipCard", () => {
    test("FaceDown goes to FaceUp", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceDown};
      let cards = [|card|];

      expect(Cards.flipCard(cards, 0, card))
      |> toEqual([|{Cards.imageId: 1, cardIndex: 0, cardState: FaceUp}|]);
    });

    test("FaceUp goes to FaceDown", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceUp};
      let cards = [|card|];

      expect(Cards.flipCard(cards, 0, card))
      |> toEqual([|{Cards.imageId: 1, cardIndex: 0, cardState: FaceDown}|]);
    });

    test("Multiple FaceUp goes to FaceDown", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceUp};
      let card2 = {Cards.imageId: 1, cardIndex: 1, cardState: FaceUp};
      let card3 = {Cards.imageId: 1, cardIndex: 2, cardState: FaceUp};
      let cards = [|card, card2, card3|];

      expect(
        cards
        ->Cards.flipCard(card.cardIndex, card)
        ->Cards.flipCard(card3.cardIndex, card3),
      )
      |> toEqual([|
           {Cards.imageId: 1, cardIndex: 0, cardState: FaceDown},
           card2,
           {Cards.imageId: 1, cardIndex: 2, cardState: FaceDown},
         |]);
    });

    test("Matched goes to Matched", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: Matched};
      let cards = [|card|];

      expect(Cards.flipCard(cards, 0, card))
      |> toEqual([|{Cards.imageId: 1, cardIndex: 0, cardState: Matched}|]);
    });
  });

  describe("setMatched", () => {
    test("sets a FaceDown card as Matched", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceDown};
      let cards = [|card|];

      expect(Cards.setMatched(cards, card))
      |> toEqual([|{Cards.imageId: 1, cardIndex: 0, cardState: Matched}|]);
    });

    test("sets a FaceUp card as Matched", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceUp};
      let cards = [|card|];

      expect(Cards.setMatched(cards, card))
      |> toEqual([|{Cards.imageId: 1, cardIndex: 0, cardState: Matched}|]);
    });

    test("sets a Matched card as Matched", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: Matched};
      let cards = [|card|];

      expect(Cards.setMatched(cards, card))
      |> toEqual([|{Cards.imageId: 1, cardIndex: 0, cardState: Matched}|]);
    });
  });

  describe("addSelection", () => {
    test("NoSelection takes a card and becomes First(card)", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceDown};

      expect(Cards.addSelection(card, NoSelection))
      |> toEqual(Cards.First({...card, Cards.cardState: FaceUp}));
    });

    test("First(card1) takes a card and becomes Second(card1, card)", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceDown};

      expect(Cards.addSelection(card, First(card)))
      |> toEqual(Cards.Second(card, {...card, Cards.cardState: FaceUp}));
    });

    test("Second(card1, card2) doesn't change", () => {
      let card = {Cards.imageId: 1, cardIndex: 0, cardState: FaceDown};
      let newCard = {Cards.imageId: 2, cardIndex: 2, cardState: FaceDown};

      expect(Cards.addSelection(newCard, Second(card, card)))
      |> toEqual(Cards.Second(card, card));
    });
  });
});
