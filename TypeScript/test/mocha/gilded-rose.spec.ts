import { expect } from 'chai';
import { Item, GildedRose } from '@/gilded-rose';

const fullItemList = [
  new Item("+5 Dexterity Vest", 10, 20), //
  new Item("Aged Brie", 2, 0), //
  new Item("Elixir of the Mongoose", 5, 7), //
  new Item("Sulfuras, Hand of Ragnaros", 0, 80), //
  new Item("Sulfuras, Hand of Ragnaros", -1, 80),
  new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
  new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
  new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
  // this conjured item does not work properly yet
  new Item("Conjured Mana Cake", 3, 6)
];

function clone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object))
}

describe('Gilded Rose', () => {

  it('should be initialized with array of Items', () => {
    const sellInDays = 100
    const quality = 50
    
    const items = [
      new Item("Aged Brie", sellInDays, quality),
      new Item("Elixir of the Mongoose", sellInDays / 2, quality / 2),
      new Item("+5 Dexterity Vest", 0, 0),
    ]

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references
    
    const itemsFromGildedRose = gildedRose.items;
    
    expect(itemsFromGildedRose).to.deep.equal(items);
  })
  
  it('should decrease properties', () => {
    const name = "Some general item without special logic"
    const sellInDays = 100
    const quality = 50
    
    const items = [
      new Item(name, sellInDays, quality),
      new Item(name, sellInDays / 2, quality / 2),
      new Item(name, 1, 1),
    ]

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items;

    gildedRose.updateItems()
    
    itemsFromGildedRose.forEach((item, index) => {
      expect(item.quality).to.be.lessThan(items[index].quality)
      expect(item.sellIn).to.be.lessThan(items[index].sellIn)
    })
  })

  /* ------ Tricky requirements ------ */

  it('After sell by date has passed quality degrades twice as fast', () => {
    const name = "Some general item without special logic"
    const sellInDays = 1
    const quality = 50
    
    const items = [
      new Item(name, sellInDays, quality)
    ]

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items;


    gildedRose.updateItems()
    
    const qualityAfterFirstUpdate = itemsFromGildedRose[0].quality
    const qualityDecreaseByDayBeforeSellDay = items[0].quality - qualityAfterFirstUpdate

    gildedRose.updateItems()

    let qualityDecreaseByDayAfterSell = qualityAfterFirstUpdate - itemsFromGildedRose[0].quality

    expect(qualityDecreaseByDayAfterSell).to.eq(qualityDecreaseByDayBeforeSellDay * 2)
  })

  it('Quality of an item is in [0, 50] range, besides Sulfuras', () => {
    const items = [
      new Item("+5 Dexterity Vest", 10, 20), //
      new Item("Aged Brie", 2, 0), //
      new Item("Elixir of the Mongoose", 5, 7), //
      // Sulfuras are exceptional and it's quality is always 80
      // new Item("Sulfuras, Hand of Ragnaros", 0, 80), //
      // new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
      // this conjured item does not work properly yet
      new Item("Conjured Mana Cake", 3, 6)
    ]

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    for (let i = 0; i < 100; i++) {
      gildedRose.updateItems()
      const everyItemQualityIsInRange = itemsFromGildedRose.every(item => item.quality >= 0 && item.quality <= 50)
      expect(everyItemQualityIsInRange).to.be.true
    }
  })

  it('Aged Brie increases in quality the older it gets', () => {
    const items = [
      new Item("Aged Brie", 2, 0)
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    gildedRose.updateItems()
    
    expect(itemsFromGildedRose[0].quality).to.be.gt(items[0].quality)
  })
  
  /* ------ Sulfuras ------ */

  it('"Sulfuras", being a legendary item, never has to be sold', () => {
    const items = [
      new Item("Sulfuras, Hand of Ragnaros", 10, 80),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Sulfuras, Hand of Ragnaros", -10, 80),
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    gildedRose.updateItems()
    
    const itemHasSameSellInDays = (item: Item, index: number) => item.quality === items[index].quality
    const everyItemHasSameSellInDays = itemsFromGildedRose.every(itemHasSameSellInDays)
    
    expect(everyItemHasSameSellInDays).to.be.true
  })

  /* ------ Backstage Passes ------ */

  // "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;

  it('"Backstage Passes" increases in `Quality`', () => {
    const items = [
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    gildedRose.updateItems()
    
    expect(itemsFromGildedRose[0].quality).to.be.gt(items[0].quality)
  })

  it('For "Backstage Passes" `Quality` increases by 2 when there are 10 days or less and by 3 when there are 5 days or less', () => {
    const items = [
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 20),
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    // Quality increase by 2 when it's 10 or less days before concert
    while (itemsFromGildedRose[0].sellIn <= 10 && itemsFromGildedRose[0].sellIn > 5) {
      const qualityBefore = itemsFromGildedRose[0].quality
      
      gildedRose.updateItems()

      const qualityAfter = itemsFromGildedRose[0].quality
      expect(qualityAfter).to.be.eq(qualityBefore + 2)
    }

    // Quality increase by 3 when it's 5 or less days before concert
    while (itemsFromGildedRose[0].sellIn <= 5 && itemsFromGildedRose[0].sellIn > 0) {
      const qualityBefore = itemsFromGildedRose[0].quality

      gildedRose.updateItems()

      const qualityAfter = itemsFromGildedRose[0].quality
      expect(qualityAfter).to.be.eq(qualityBefore + 3)
    }
  })
  
  it('For "Backstage Passes" `Quality` drops to 0 after the concert', () => {
    const items = [
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    while (itemsFromGildedRose[0].sellIn >= 0) {
      gildedRose.updateItems()
    }
    
    expect(itemsFromGildedRose[0].quality).to.be.eq(0)
  })
  
  /* ------ Quality Assurance ------ */
  
  it('"Sulfuras", being a legendary item, always has Quality equal 80', () => {
    const items = [
      new Item("Sulfuras, Hand of Ragnaros", 0, 80), //
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),
    ]

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    gildedRose.updateItems()
    const everyItemQualityIs80 = itemsFromGildedRose.every(item => item.quality === 80)
    
    expect(everyItemQualityIs80).to.be.true
  })

  /* ------ Aged Brie ------ */

  it('"Aged Brie" increases in `Quality` by 2', () => {
    const items = [
      new Item("Aged Brie", -1, 0), //
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    gildedRose.updateItems()
    
    expect(itemsFromGildedRose[0].quality).to.be.eq(items[0].quality + 1)
  })

  /* ------ Aged Brie ------ */

  it('"Aged Brie" increases in `Quality` by 1', () => {
    const items = [
      new Item("Aged Brie", -1, 0), //
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    gildedRose.updateItems()
    
    expect(itemsFromGildedRose[0].quality).to.be.eq(items[0].quality + 1)
  })

  /* ------ Conjured Mana Cake ------ */

  it('"Conjured Mana Cake" quality decrease twice as fast', () => {
    const items = [
      new Item("Conjured Mana Cake", 1, 20), //
    ] //

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    gildedRose.updateItems()
    
    expect(itemsFromGildedRose[0].quality).to.be.eq(18)
  
    expect(itemsFromGildedRose[0].sellIn).to.be.eq(0)
    
    gildedRose.updateItems()
  
    expect(itemsFromGildedRose[0].sellIn).to.be.eq(-1)
    
    expect(itemsFromGildedRose[0].quality).to.be.eq(14)

    gildedRose.updateItems()

    expect(itemsFromGildedRose[0].sellIn).to.be.eq(-2)
    
    expect(itemsFromGildedRose[0].quality).to.be.eq(10)
  })

});
