
$(document).ready(function() {
    $( window ).resize(function() {
        SliderWidth = []
        SliderListsItemWidth = []
        $(".slider-list").map(function() {
               SliderWidth.push($(this).width())
               let width = 0
               $(this).children().map(function() {
                   width = $(this).width()
               });
               SliderListsItemWidth.push(width)
       });
    });

    Counter = 0
    DupeCount = 2
    SliderLists = []
    SliderListsTargets = []
    SliderListsItemWidth = []
    Timers = []
    AutoSwitchTime = 5.0
    AutoSwitchTimers = []
    
    let MaxAnimTime = 2.0
    SliderWidth = []

    function PrefCard(i)
    {
      let lastItem = SliderListItems[i].pop()
      let firstItem = SliderListItems[i][0]
      lastItem.insertBefore( firstItem );
    	SliderListItems[i].unshift(lastItem);
      AutoSwitchTimers[i] = 0.0
    		Timers[i] = 0
      SliderLists[i].css('left', parseInt(SliderLists[i].css('left'))-SliderListsItemWidth[i])
    }

    function NextCard(i)
    {
        let firstItem = SliderListItems[i].shift()
        let lastItem = SliderListItems[i][SliderListItems[i].length-1]
        firstItem.insertAfter(lastItem);
    		SliderListItems[i].push(firstItem);
    	Timers[i] = 0
        AutoSwitchTimers[i] = 0.0
        SliderLists[i].css('left', parseInt(SliderLists[i].css('left'))+SliderListsItemWidth[i])
    }

     SliderListItems = []

     i=0
     $(".slider-navigator.next-slide").map(function() {
     	let cur = i
     	$(this).click(function() {
     			NextCard(cur);
     	});
     });
     
     i=0
     $(".slider-navigator.prev-slide").map(function() {
     	let cur = i
     	$(this).click(function() {
     			PrefCard(cur);
     	});
     });

     $(".slider-list").map(function() {
     	Timers.push(0)
      AutoSwitchTimers.push(0)

     	SliderWidth.push($(this).width())
     	SliderLists.push($(this))
     	children = []
     	let width = 0
      $(this).children().map(function() {
      	
      	width = $(this).width()
      	children.push($(this))
      });
      SliderListsItemWidth.push(width)
      SliderListsTargets.push(children.length*DupeCount/2)
    
      SliderListItems.push(children)
      Counter++
     });

     for (i in SliderLists){
     	let newChildren = []
     	for (let g = 0; g < DupeCount; g++) {
     		for (c of SliderListItems[i])
      	{
        	let Clone = c.clone()
      		Clone.appendTo( SliderLists[i] )
          newChildren.push(Clone)
      	}
      }
      SliderListItems[i] = SliderListItems[i].concat(newChildren)
     }

     function Lerp(a, b, f)
    	{
      return a * (1.0 - f) + (b * f);
    	}
    let startTime = Date.now();
    
    function Update(){
    
     	let currentTime = Date.now();
    	let deltaTime = currentTime - startTime;
    	startTime = currentTime;

     	for(i in SliderLists)
      {
        Timers[i] += deltaTime/1000
        AutoSwitchTimers[i] += deltaTime/1000
      	if(AutoSwitchTimers[i] > AutoSwitchTime ){
       		 	NextCard(i)
      			AutoSwitchTimers[i] = 0
      	}
      	Timers[i] = Math.min(Timers[i],MaxAnimTime)
      	let CurrPos = parseInt(SliderLists[i].css('left'))
        let TPos = SliderListsTargets[i]*-SliderListsItemWidth[i]-SliderListsItemWidth[i]/2+SliderWidth/2
      	let dif = CurrPos-TPos
        if(Math.abs(dif)<20){
        	Timers[i]+=Timers[i]*0.3
        }
        let newPos = Lerp(CurrPos,TPos,Timers[i]/MaxAnimTime)
        SliderLists[i].css('left', newPos)
      }
    		window.requestAnimationFrame(Update);
     }
     
     window.requestAnimationFrame(Update);
     
     //swipe
     document.addEventListener('touchstart', handleTouchStart, false);        
      document.addEventListener('touchmove', handleTouchMove, false);
   
    	 var xDown = null;                                                        
    	 var yDown = null;
   
    	 function getTouches(evt) {
    	 return evt.touches ||             // browser API
    	        evt.originalEvent.touches; // jQuery
    	 }                                                     
     
    	 function handleTouchStart(evt) {
    	   const firstTouch = getTouches(evt)[0];                                      
    	   xDown = firstTouch.clientX;                                      
    	   yDown = firstTouch.clientY;                                      
    	 };                                                  
     
    	 function handleTouchMove(evt) {
    	    if ( ! xDown || ! yDown ) {
    	        return;
    	    }
        
    	    var xUp = evt.touches[0].clientX;                                    
    	    var yUp = evt.touches[0].clientY;
        
    	    var xDiff = xDown - xUp;
    	    var yDiff = yDown - yUp;
        
    	    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
    	       if ( xDiff > 0 ) {
             	for(i in SliderLists)
      				{
                NextCard(i)
              }
    
    	           /* right swipe */ 
    	       } else {
             	for(i in SliderLists)
      				{
              	PrefCard(i)
              }
    	           /* left swipe */
    	       }
    	      }else {
    	        if ( yDiff > 0 ) {
    	            /* down swipe */ 
    	        } else { 
    	            /* up swipe */
    	        }                                                                 
    	    }
    	    /* reset values */
    	    xDown = null;
    	    yDown = null;                                             
    	};
 

  });
