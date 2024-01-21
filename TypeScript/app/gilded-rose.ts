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
    switch(item.name) {
      case 'Aged Brie':
        this.increaseQuality(item)
        break
      case 'Backstage passes to a TAFKAL80ETC concert':
        this.increaseTicketQuality(item)
        break
      case 'Sulfuras, Hand of Ragnaros':
        break
      default:
        this.decreaseQuality(item)
    }

    this.updateSellInDays(item)
    
    if (item.sellIn >= 0) return

    switch (item.name) {
      case 'Backstage passes to a TAFKAL80ETC concert':
        // Ticket expiry
        item.quality = 0
        break
      default:
        this.decreaseQuality(item)
        break
    }
  }

  private updateSellInDays(item: Item) {
    // Sulfuras doesn't age
    if (item.name == 'Sulfuras, Hand of Ragnaros') return

    item.sellIn = item.sellIn - 1;
  }

  private increaseQuality(item: Item) {
    if (item.quality < 50) item.quality += 1
  }

  private decreaseQuality(item: Item) {
    if (item.name === 'Aged Brie') return
    if (item.name === 'Sulfuras, Hand of Ragnaros') return
    
    if (item.quality > 0) item.quality -= 1
  }

  private increaseTicketQuality(item: Item) {
    if (item.quality >= 50) return 

    item.quality = item.quality + 1

    if (item.sellIn <= 10 && item.quality < 50) {
      item.quality = item.quality + 1
    }
    
    if (item.sellIn <= 5 && item.quality < 50) {
      item.quality = item.quality + 1
    }
  }
}
