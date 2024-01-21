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
        this.updateTicketQuality(item)
        break
      case 'Sulfuras, Hand of Ragnaros':
        break
      default:
        this.decreaseQuality(item)
    }

    this.updateSellInDays(item)
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
    if (item.quality > 0) item.quality -= 1
    if (item.sellIn <= 0 && item.quality > 0) item.quality -= 1
  }

  private updateTicketQuality(item: Item) {
    if (item.sellIn <= 0) { 
      item.quality = 0 
      return 
    }
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
