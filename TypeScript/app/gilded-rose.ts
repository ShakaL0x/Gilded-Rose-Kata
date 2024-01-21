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
    if (
      item.name == 'Aged Brie' ||
      item.name == 'Backstage passes to a TAFKAL80ETC concert' ||
      item.name == 'Sulfuras, Hand of Ragnaros'
    ) {
      // Increase +1 and does ticket handling
      
      if (item.quality < 50) {
        if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
          this.increaseTicketQuality(item)
        } else {
          this.increaseQuality(item)
        }
      }
    } else {
      this.decreaseQuality(item)
    }

    this.updateSellInDays(item)

    if (item.sellIn < 0) {
      // Ticket expiry
      if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
        item.quality = 0
      }

      this.decreaseQuality(item)
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
    if (item.name === 'Backstage passes to a TAFKAL80ETC concert') return
    
    if (item.quality == 0) return
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
