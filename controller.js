import View from "./view.js";
import Model from "./model.js";
let model = new Model();
export default class Controller {
    constructor() {
        this.view = new View(this);
    }

    initModel(){
        
        model.addLast("1")
        model.addLast("2")
        model.addLast("3")
        model.addLast("4")
        model.addLast("5")
        model.addLast("6")
        
        let cur = model.head;
        while (cur !== null) {
            this.view.addBallToChain(this.view.createBallElement(cur.data, cur));
            cur = cur.next;
        }

        return model;
    }

    insertBefore(newBall, existingBall){
        model.insertBeforeNode(newBall.modelNode,existingBall.modelNode)
        //model.dumpList();console.log('/N');
        this.removeMatches(this.findMatchesAround(newBall.modelNode),newBall.modelNode)
        this.checkCascadingMatches()
        
    }
    insertAfter(newBall, existingBall){
        model.insertAfterNode(newBall.modelNode,existingBall.modelNode)
        //model.dumpList();console.log('/N');
        this.removeMatches(this.findMatchesAround(newBall.modelNode),newBall.modelNode)
        this.checkCascadingMatches()

    }

    findMatchesAround(node){
        const matches = []
      
      
        //go left while nodes color is same
        let before = node;
        while(before.prev != null && before.prev.data == node.data){
          matches.push(before.prev)
          before = before.prev;
        }
        let after = node;
        while(after.next != null && after.next.data == node.data){
          matches.push(after.next)
          after = after.next;
        }
        //console.log(before);
        //console.log(after);
        
      
        return matches;
      
    }

    checkCascadingMatches(){
        let cur = model.head;
        while(cur !== null){
            let potentialMatches = this.findMatchesAround(cur)
            if(potentialMatches.length>=2){
                this.removeMatches(potentialMatches,cur)
            }
            cur = cur.next;
        }
    }

    removeMatches(matches,node){
        if(matches.length>=2){
            matches.push(node)
            //PROC VIEW
            this.view.explodeBalls(matches)
            console.log('*****************');
            console.log('MATCHES FOUND PRINTING BEFORE');
            console.log('*****************');
            model.dumpList();
           // model.removeNode(node)
            matches.forEach(match =>{
            model.removeNode(match)
        })
        }
        console.log('*****************');
        console.log('printering after deletion');
        console.log('*****************');
        model.dumpList();
        
    }


}


let run = new Controller()//WHY???