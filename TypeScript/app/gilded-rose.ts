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
    this.items.forEach(this.updateItem)

    return this.items;
  }

  updateItem(item: Item) {
    if (
      item.quality > 0 &&
      item.name != 'Aged Brie' && 
      item.name != 'Backstage passes to a TAFKAL80ETC concert' &&
      item.name != 'Sulfuras, Hand of Ragnaros'
    ) {
      item.quality = item.quality - 1
    } else {
      // Increase +1 or ticket handling
      if (item.quality < 50) {
        item.quality = item.quality + 1
        
        if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
          
          if (item.sellIn <= 10) {
            if (item.quality < 50) {
              item.quality = item.quality + 1
            }
          }
          
          if (item.sellIn <= 5) {
            if (item.quality < 50) {
              item.quality = item.quality + 1
            }
          }
        }
      }
    }


    if (item.name != 'Sulfuras, Hand of Ragnaros') {
      item.sellIn = item.sellIn - 1;
    }

    if (item.sellIn < 0) {
      if (item.name != 'Aged Brie') {
        if (item.name != 'Backstage passes to a TAFKAL80ETC concert') {
          if (item.quality > 0) {
            if (item.name != 'Sulfuras, Hand of Ragnaros') {
              item.quality = item.quality - 1
            }
          }
        } else {
          item.quality = item.quality - item.quality
        }
      } else {
        if (item.quality < 50) {
          // Useless code?
          item.quality = item.quality + 1
        }
      }
    }
  }
}
