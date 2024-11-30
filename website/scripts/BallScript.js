$(document).ready(function() {

window.mobileAndTabletCheck = function() {
   let check = false;
   (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
   return check;
 };
userAgent = navigator.userAgent.toLowerCase();
isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

isMobile = window.mobileAndTabletCheck()&&!isTablet;

HeroTimer = 0.0
HeroTime = 3

Gballs = []
GballsInitPos = []
GballsInitCss = []
GballsVel = []
DisiredVec = []
DisiredSpeed = []
AngVel = []
InitCSS = []
ignoreSpeedModTimer = -3
ignoreSpeedModTime = 1
GballsSize = []
Gballs = []
MousePos = [0,0]
MaxAngVel = 5
SPEED = 0.007
IteractionSPEED = 0.8
$Window = $(window)
ActiveRange = 1000000
document.addEventListener('mousemove', (event) => {
	MousePos = [event.clientX,event.clientY+$Window.scrollTop()];
});

function UpdateGballs(init){
  GballsInitPos = []
  GballsSize = []
  i=0
	$(".gball").map(function() {

    if(init)
    {
      Gballs.push($(this))
      GballsInitPos.push([$(this).offset().left,$(this).offset().top])
      GballsSize.push([$(this).width(),$(this).height()])
      GballsVel.push([(Math.random()*2-1)*40.0,(Math.random()*2-1)*40.0])
      GballsInitCss.push({"top":$(this).css('top'),"left":$(this).css('left'),"right":$(this).css('right')})
      DisiredVec.push([Math.random()*2-1,Math.random()*2-1])
      DisiredSpeed.push(Math.random()*2-1)
      AngVel.push((Math.random()*2-1)*MaxAngVel)
      GballsSize.push([$(this).width(),$(this).height()])
    }
    else
    {
      Gballs[i].css(GballsInitCss[i]);
      GballsInitPos[i] = ([Gballs[i].offset().left,Gballs[i].offset().top])
      GballsSize[i] = ([Gballs[i].width(),Gballs[i].height()])
    }
		i++
  });
}

addEventListener("resize", (event) => {
	UpdateGballs(false);
});

$(".buttonholderhome-copy").click(function() {
  OnBallClicked(MousePos[0],MousePos[1],100000000)
});

$(".div-block-53-copy").click(function() {
  OnBallClicked(MousePos[0],MousePos[1],100000000)
});

UpdateGballs(true);

function NormalizeV(V){
	let l = Math.sqrt(V[0]*V[0]+V[1]*V[1])
	return [V[0]/l,V[1]/l]
}
function VectorDotProduct(v1, v2)
{	
	let newV1 = NormalizeV(v1)
	let newV2 = NormalizeV(v2)

  return newV1[0] * newV2[0] + newV1[1] * newV2[1];
}

var rotateVector = function(vec, ang)
{
    ang = -ang * (Math.PI/180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Array(vec[0] * cos - vec[1] * sin, vec[0] * sin + vec[1] * cos);
};


function OnBallClicked(X,Y,int){
  for (i in Gballs){
    let Offset = [Gballs[i].offset().left,Gballs[i].offset().top]

    let centerX = Offset[0]+GballsSize[i][0]/2
    let centerY = Offset[1]+GballsSize[i][1]/2
    distToMouse =(centerX-X)*(centerX-X)+(centerY-Y)*(centerY-Y)
    let V = [centerX-X,centerY-Y]
    NV = NormalizeV(V)
    GballsVel[i][0] += (NV[0])*Math.min(int/distToMouse/5,300)
    GballsVel[i][1] += (NV[1])*Math.min(int/distToMouse/5,300)
    ignoreSpeedModTimer = 0
  }
}

addEventListener('click', (event) => {
  X = event.clientX
  Y = event.clientY+$Window.scrollTop()
  OnBallClicked(X,Y,10000000)
});

let startTime = Date.now();
function Update() {
		let i = 0
    let currentTime = Date.now();
    let deltaTime = currentTime - startTime;
    ignoreSpeedModTimer += deltaTime/1000
    HeroTimer += deltaTime/1000
    startTime = currentTime;
		for (b of Gballs){

      if(!GballsVel[i][0] || !GballsVel[i][1])
      {
        GballsVel[i] = [(Math.random()*2-1)*40.0,(Math.random()*2-1)*40.0]
      }

      let Offset = [b.offset().left,b.offset().top]
    	GballsVel[i][0] += (GballsInitPos[i][0]-Offset[0])*SPEED
			GballsVel[i][1] += (GballsInitPos[i][1]-Offset[1])*SPEED
      let centerX = Offset[0]+GballsSize[i][0]/2
      let centerY = Offset[1]+GballsSize[i][1]/2

      if(ignoreSpeedModTimer>ignoreSpeedModTime)
      {
        distToTargQuad = (Offset[0]-GballsInitPos[i][0])*(Offset[0]-GballsInitPos[i][0])+(Offset[1]-GballsInitPos[i][1])*(Offset[1]-GballsInitPos[i][1])
        SpeedMod = Math.min(Math.max(distToTargQuad/ActiveRange*100, 0), 1) 
        GballsVel[i][0] *= SpeedMod
        GballsVel[i][1] *= SpeedMod
      }

      distToMouse =(centerX-MousePos[0])*(centerX-MousePos[0])+(centerY-MousePos[1])*(centerY-MousePos[1])
      if(distToMouse < ActiveRange){
      	let V = [centerX-MousePos[0],centerY-MousePos[1]]
      	NV = NormalizeV(V)
      	GballsVel[i][0] += (NV[0])*IteractionSPEED*(1-distToMouse/ActiveRange)
				GballsVel[i][1] += (NV[1])*IteractionSPEED*(1-distToMouse/ActiveRange)
      }

      let randRot = Math.random()*2-1

			GballsVel[i][0] +=  DisiredVec[i][0]*DisiredSpeed[i]
     	GballsVel[i][1] +=  DisiredVec[i][1]*DisiredSpeed[i]
      DisiredSpeed[i] += randRot/25
      DisiredSpeed[i] = Math.max(0.1,Math.min(DisiredSpeed[i],0.75))
      AngVel[i] += randRot
      AngVel[i] = Math.max(-MaxAngVel,Math.min(AngVel[i],MaxAngVel))

      DisiredVec[i] = rotateVector(DisiredVec[i],AngVel[i]*DisiredSpeed[i])
      HeroCalc =  Math.min(HeroTimer/HeroTime/5.0,0.2)
      GballsVel[i][0] = (GballsInitPos[i][0]-Offset[0])*SPEED*HeroCalc+GballsVel[i][0]*(1-HeroCalc)
			GballsVel[i][1] = (GballsInitPos[i][1]-Offset[1])*SPEED*HeroCalc+GballsVel[i][1]*(1-HeroCalc)
      
      let target = [Offset[0]+GballsVel[i][0],Offset[1]+GballsVel[i][1]]

			b.offset({left:target[0],top:target[1]})
      i++
    }
    // UpdateUI();
    window.requestAnimationFrame(Update);
  }
if(!isMobile)
{
  window.requestAnimationFrame(Update);
}

});