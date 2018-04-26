var fps = 60;
var width = 400;
var height = 400;
var capacity = 5;
var id = 0;
var entWidth = 5;
var entHeight = 5;
var qt;

function setup()
{
  createCanvas(400, 400);
	frameRate(fps);
  background(000);
  qt = new Quadtree(capacity, width, height, 100);
}

function draw()
{
  renderQuadtree(qt.getHead());
  qt.getEntities().forEach((ent) => renderEntity(ent));
}

function mouseClicked()
{
  addEntity(mouseX, mouseY);
}



function renderQuadtree(qtn)
{
  if (qtn.lu === undefined) return;
  renderQuadtreeNode(qtn);

  renderQuadtree(qtn.getLU());
  renderQuadtree(qtn.getRU());
  renderQuadtree(qtn.getLD());
  renderQuadtree(qtn.getRD());
}

function renderQuadtreeNode(qtn)
{
  stroke(color('#fff'));
  line(qtn.getCenter().getX() - qtn.getWidth() / 2, qtn.getCenter().getY(),
      qtn.getCenter().getX() + qtn.getWidth() / 2, qtn.getCenter().getY()); // horizontal line
  line(qtn.getCenter().getX(), qtn.getCenter().getY() - qtn.getHeight() / 2,
      qtn.getCenter().getX(), qtn.getCenter().getY() + qtn.getHeight() / 2); // vertical line
}

function addEntity(x, y)
{
  let ent = new Entity(new Position(x, y), entWidth, entHeight, id++);
  qt.insert(ent);
}

function renderEntity(ent)
{
  noStroke();
  fill(color('#fff'));
  ellipse(ent.getCenter().getX(), ent.getCenter().getY(), ent.getWidth(), ent.getHeight());
}
