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

  // Wraps all quality parameter updates
  private updateQuality(item: Item) { 
    let standardChange = -1
    let change = standardChange
    
    if      (item.name === 'Backstage passes to a TAFKAL80ETC concert') change = this.getTicketQualityChange(item)
    else if (item.name === 'Sulfuras, Hand of Ragnaros') return
    else if (item.name === 'Aged Brie') change = +1
    else    {
      const isExpired = item.sellIn <= 0
      const isConjured = item.name === 'Conjured Mana Cake'
  
      let decrease = isExpired? standardChange * 2 : standardChange
      decrease *= isConjured? 2 : 1
  
      change = decrease
    }

    this.changeQuality(item, change)
  }

  private getTicketQualityChange(item: Item) {
    // Concert passed
    if (item.sellIn <= 0) return -item.quality
    // Concert is very close
    else if (item.sellIn <= 5) return +3
    // Concert is close
    else if (item.sellIn <= 10) return +2
    
    return +1
  }

  // Updates quality with overflow/underflow protection
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
