export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateItems() {
    for (const item of this.items) {
      this.updateItem(item)
    }

    return this.items;
  }

  private updateItem(item: Item) {
    this.updateQuality(item)
    this.updateSellInDays(item)
  }

  private updateQuality(item: Item) { 
    const isExpired = item.sellIn <= 0
    const isConjured = item.name === 'Conjured Mana Cake'

    switch(item.name) {
      case 'Backstage passes to a TAFKAL80ETC concert':
        this.updateTicketQuality(item)
        return
      case 'Sulfuras, Hand of Ragnaros':
        return
      case 'Aged Brie':
        this.changeQuality(item, +1)
        return
    }

    const baseDecrease = -1

    let decrease = isExpired? baseDecrease * 2 : baseDecrease
    decrease *= isConjured? 2 : 1

    this.changeQuality(item, decrease)
  }

  private updateTicketQuality(item: Item) {
    let change = +1
    
    // Ticket expired
    if (item.sellIn <= 0) change = -item.quality
    // Concert is very close
    else if (item.sellIn <= 5) change = +3
    // Concert is close
    else if (item.sellIn <= 10) change = +2

    this.changeQuality(item, change)
  }

  // Quality update protected from overflows/underflows
  private changeQuality(item: Item, change: number) {    
    item.quality += change

    // Overflow/underflow protection
    if (item.quality > 50) item.quality = 50
    else if (item.quality < 0) item.quality = 0
  }

  private updateSellInDays(item: Item) {
    // Sulfuras is a legendary item that doesn't age
    if (item.name == 'Sulfuras, Hand of Ragnaros') return

    item.sellIn = item.sellIn - 1;
  }
}
