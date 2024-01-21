enum ExceptionalItems {
  // Sulfuras is a legendary item that doesn't age or change in quality, 
  // it always have 80 quality
  sulfuras = 'Sulfuras, Hand of Ragnaros',
  conjured = 'Conjured Mana Cake',
  backstagePass = 'Backstage passes to a TAFKAL80ETC concert',
  brie = 'Aged Brie'
}

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
    const change = this.getQualityChange(item)
    this.changeQuality(item, change)
  }

  private getQualityChange(item: Item): number {
    const isExpired = item.sellIn <= 0
    
    const exceptionalItemsChangeDictionary = {
      [ExceptionalItems.backstagePass]: this.getBackstagePassQualityChange(item),
      [ExceptionalItems.sulfuras]: 0,
      [ExceptionalItems.brie]: +1,
      [ExceptionalItems.conjured]: isExpired? -4 : -2
    }
    
    return exceptionalItemsChangeDictionary[item.name] ?? (isExpired? -2 : -1)
  }

  private getBackstagePassQualityChange(item: Item) {
    // Concert passed
    if (item.sellIn <= 0) return -item.quality
    // Concert is very close
    else if (item.sellIn <= 5) return +3
    // Concert is close
    else if (item.sellIn <= 10) return +2
    // Concert became a little close
    return +1
  }

  // Changes quality with overflow/underflow protection
  private changeQuality(item: Item, change: number) {
    if (item.name === ExceptionalItems.sulfuras) return item.quality = 80
    
    item.quality += change

    // Overflow/underflow protection
    if (item.quality > 50) item.quality = 50
    else if (item.quality < 0) item.quality = 0
  }

  private updateSellInDays(item: Item) {
    // Sulfuras is a legendary item that doesn't age
    if (item.name === ExceptionalItems.sulfuras) return

    item.sellIn = item.sellIn - 1;
  }
}
