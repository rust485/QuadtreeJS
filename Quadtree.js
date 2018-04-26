class Position
{
  constructor(x, y) { this.x = x; this.y = y; }
  equals(p) { return p.x === this.x && p.y === this.y; }
  getX() { return this.x; }
  getY() { return this.y; }
  toString() { return "(" + this.x + ", " + y + ")"; }
}

class Entity
{
  constructor(center, width, height, id) { this.id = id; this.center = center; this.width = width; this.height = height; }
  equals(e) { return this.id === e.id; }
  getId() { return this.id; }
  getCenter() { return this.center; }
  getWidth() { return this.width; }
  getHeight() { return this.height; }
}

class QuadtreeNode
{
  constructor(center, width, height, capacity, maxDepth)
  {
    this.center = center;
    this.width = width;
    this.height = height;
    this.capacity = capacity;
    this.entities = []; // contains all the children in this node or in union of all children nodes if already split
    this.maxDepth = maxDepth;

    // left up, right up, left down, and right down children. initially not split
    this.lu = this.ru = this.ld = this.rd = undefined;
  }

  insert(ent)
  {
    this.entities.push(ent);
    if (this.lu === undefined)
    {
      if (this.entities.length == this.capacity && this.maxDepth > 1)
        this.splitUp();
    }
    else this.insertInChild(ent);

    return this.depth;
  }

  splitUp()
  {
    this.lu = new QuadtreeNode(new Position(this.center.x - this.width / 4, this.center.y + this.height / 4),
                              this.width / 2, this.height / 2, this.capacity, this.maxDepth - 1);
    this.ru = new QuadtreeNode(new Position(this.center.x + this.width / 4, this.center.y + this.height / 4),
                              this.width / 2, this.height / 2, this.capacity, this.maxDepth - 1);
    this.ld = new QuadtreeNode(new Position(this.center.x - this.width / 4, this.center.y - this.height / 4),
                              this.width / 2, this.height / 2, this.capacity, this.maxDepth - 1);
    this.rd = new QuadtreeNode(new Position(this.center.x + this.width / 4, this.center.y - this.height / 4),
                              this.width / 2, this.height / 2, this.capacity, this.maxDepth - 1);
    this.entities.forEach((ent) => this.insertInChild(ent));
  }

  insertInChild(ent)
  {
    this.getProperChild(ent).insert(ent);
  }

  getProperChild(ent)
  {
    if (ent.center.y >= this.center.y) return (ent.center.x >= this.center.x) ? this.ru : this.lu;
    else return (ent.center.x >= this.center.x) ? this.rd : this.ld;
  }

  getEntities()
  {
    return this.entities;
  }

  removeById(entId)
  {
    this.entities.filter((e) => e.id !== entId);
    if (this.lu !== undefined)
    {
      // don't know which child will have entity with given ID
      this.lu.removeById(entId);
      this.ru.removeById(entId);
      this.ld.removeById(entId);
      this.rd.removeById(entId);
    }
  }

  removeObj(ent)
  {
    this.entities.filter((e) => !e.equals(ent));
    getProperChild(ent).removeObj(ent);
  }

  getWidth()    { return this.width; }
  getHeight()   { return this.height; }
  getCapacity() { return this.capacity; }
  getCenter()   { return this.center; }
  getLU()       { return this.lu; }
  getRU()       { return this.ru; }
  getLD()       { return this.ld; }
  getRD()       { return this.rd; }
}

class Quadtree
{
  /**
   * Constructs a new quadtree with the given capacity
   * @method constructor
   * @param  {Number}    capacity - the maximum number of elements in a given portion
   *                                of a quadtree before node is broken down
   */
  constructor(capacity, width, height, maxDepth)
  {
    this.capacity = capacity;
    this.maxDetph = maxDepth;
    this.head = new QuadtreeNode(new Position(width / 2, height / 2), width, height, capacity, maxDepth);
  }

  insert(ent)       { this.head.insert(ent); }
  removeById(entId) { this.head.removeById(entId); }
  removeObj(ent)    { this.head.removeObj(ent); }
  getCapicity()     { return this.capacity; }
  getHead()         { return this.head; }
  getWidth()        { return this.head.getWidth(); }
  getHeight()       { return this.head.getHeight(); }
  getCapacity()     { return this.head.getCapacity(); }
  getEntities()     { return this.head.getEntities(); }
  getMaxDepth()     { return this.maxDepth; }
}
