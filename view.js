
//TODO fix reload after match
//TODO fix endless loop if click right side on last marble



let cannonBall = null;

export default class View {
  constructor(controller) {
    this.controller = controller;
    this.clickBall = this.clickBall.bind(this); //IDGI???
    window.addEventListener("load", this.start.bind(this)); //I DO NOT UDERSTAND THIS
  }

  start() {
    this.controller.initModel();
    

    this.reloadCannon();
  }

  addBallToChain(ball) {
    // add ball to element
    document.querySelector("#balls").appendChild(ball);
    this.makeBallClickable(ball);
  }

  createNewBallElement(balltype) {
    const ball = document.createElement("div");
    ball.className = "ball";
    const img = document.createElement("img");
    img.src = `images/marble${balltype}.png`;
    img.dataset.balltype = balltype;
    ball.dataset.balltype = balltype;
    ball.modelNode = {
      prev: null,
      next: null,
      data: balltype,
    };
    ball.appendChild(img);
    return ball;
  }
  createBallElement(balltype, node) {
    const ball = document.createElement("div");
    ball.className = "ball";
    const img = document.createElement("img");
    img.src = `images/marble${balltype}.png`;
    img.dataset.balltype = balltype;
    ball.dataset.balltype = balltype;
    ball.modelNode = node;
    ball.appendChild(img);
    return ball;
  }
  makeBallClickable(ball) {
    // add eventlistener to click on ball
    ball.querySelector("img").addEventListener("click", this.clickBall);
  }
  clickBall(event) {
    const side =
      event.offsetX / event.target.offsetWidth < 0.5 ? "before" : "after";

    const newBall = cannonBall;

    const source = newBall.getBoundingClientRect();

    const existingBall = event.target.parentElement;
    if (side === "before") {
      // insert cannonBall before existing ...
      existingBall.parentNode.insertBefore(newBall, existingBall);
      this.controller.insertBefore(newBall, existingBall);
    } else {
      // insert cannonBall after this
      existingBall.parentNode.insertBefore(newBall, existingBall.nextElementSibling);
      this.controller.insertAfter(newBall, existingBall);
    }

    //************ANIMATION STUFF*************************** */

    const img = newBall.firstElementChild;
    // 1. Find current position of the cannonball - that is the destination
    const dest = img.getBoundingClientRect();

    // 2. Translate it back to the starting-position
    const deltaX = source.x - dest.x;
    const deltaY = source.y - dest.y;

    // 3. Animate it to destination-position (translate->0)
    img.style.setProperty("--delta-x", deltaX + "px");
    img.style.setProperty("--delta-y", deltaY + "px");
    img.classList.add("animatefromcannon");
    // while doing that - animate the space
    newBall.classList.add("expand");

    newBall.addEventListener("animationend", animationComplete);

    const self = this; //needed to access View methods inside inner function

    function animationComplete() {
      newBall.removeEventListener("animationend", animationComplete);
      newBall.classList.remove("expand");
      img.classList.remove("animatefromcannon");
      img.style.removeProperty("--delta-x");
      img.style.removeProperty("--delta-y");

      // make newBall clickable as well
      self.makeBallClickable(newBall);

      // create new cannonball
      self.reloadCannon();
    }
  }
  reloadCannon() {
    // loads the cannon with a random ball
    const balltype = Math.ceil(Math.random() * 6);
    this.loadCannonWithBall(this.createNewBallElement(balltype));
  }

  loadCannonWithBall(newCannonBall) {
    cannonBall = newCannonBall;
    document.querySelector("#cannon").appendChild(cannonBall);
  }
  explodeBalls(matches) {
    const balls = document.querySelectorAll(".ball");

    matches.forEach((element) => {
      balls.forEach((ball) => {
        if (ball.modelNode === element) {
          // Create a GIF element
          const gif = document.createElement("img");
          gif.src = "images/discord-discordgifemoji.gif";
          gif.classList.add("gif-animation");

          // Position the GIF element over the ball
          const ballRect = ball.getBoundingClientRect();
          gif.style.position = "absolute";
          gif.style.left = ballRect.left + "px";
          gif.style.top = ballRect.top + "px";
          gif.style.width = ballRect.width + "px";
          gif.style.height = ballRect.height + "px";
          gif.style.zIndex = "9999"; 

          
          document.body.appendChild(gif);

          // Delay the removal of the ball element to allow time for the animation
          setTimeout(() => {
            ball.remove(); 
            gif.remove(); 
          }, 1000); 
        }
      });
    });
  }
}
