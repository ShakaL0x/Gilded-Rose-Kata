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

function findItemsInGildedRose(gildedRose: GildedRose, nameToFind: string): Item[] {
  return gildedRose.items.filter(item => item.name === nameToFind)
}

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

    gildedRose.updateQuality()
    
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


    gildedRose.updateQuality()
    
    const qualityAfterFirstUpdate = itemsFromGildedRose[0].quality
    const qualityDecreaseByDayBeforeSell = items[0].quality - qualityAfterFirstUpdate

    gildedRose.updateQuality()

    let qualityDecreaseByDayAfterSell = qualityAfterFirstUpdate - itemsFromGildedRose[0].quality

    expect(qualityDecreaseByDayAfterSell).to.eq(qualityDecreaseByDayBeforeSell * 2)
  })

  it('Quality of an item is never negative', () => {
    const items = fullItemList

    const gildedRose = new GildedRose(clone(items)); // clones items to not pass references

    const itemsFromGildedRose = gildedRose.items; // gets reference that updates on update()

    

    gildedRose.updateQuality()

  })
  it('Aged Brie increases in quality the older it gets', () => {})
  
  /* ------ Sulfuras ------ */

  it('"Sulfuras", being a legendary item, never has to be sold', () => {})

  /* ------ Backstage Passes ------ */

  // "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
  it('For "Backstage Passes" `Quality` increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but', () => {})
  it('Quality drops to 0 after the concert', () => {})
  
  /* ------ Quality Assurance ------ */
  
  it('Quality of an item is never more than 50', () => {})
  it('Quality of an item is never more than 50 for Aged Brie', () => {})
  it('"Sulfuras", being a legendary item, never decreases in Quality', () => {})
  it('"Sulfuras", being a legendary item, has `Quality` equal 80', () => {})
});
