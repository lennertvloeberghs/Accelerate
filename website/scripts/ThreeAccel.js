const VS = `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrixInverse;
uniform vec3 cameraPosition;
attribute vec3 normal;

varying vec3 vertexWorldPos;
varying vec3 vertexPos;

varying vec2 texCoordOut;
varying vec3 vNormalW; 
varying vec3 vPositionW;
varying vec3 vCamPos;

    void main() {
      vec4 tempPos = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * tempPos; 
      vertexWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      vertexPos = position;
      texCoordOut = uv;
      vCamPos = cameraPosition;
      vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
      vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
    }
`;

const FS = `
precision mediump float;

uniform vec3 MousePos;
uniform vec3 ObjPos;
uniform float colorR;

varying vec3 vertexWorldPos;
varying vec3 vNormalW; 
varying vec3 vPositionW;
varying vec3 vertexPos;
varying vec3 vCamPos;

vec2 GetGradient(vec2 intPos, float t) {
    float rand = fract(sin(dot(intPos, vec2(12.9898, 78.233))) * 43758.5453);;
    
    // Rotate gradient: random starting rotation, random rotation rate
    float angle = 6.283185 * rand + 4.0 * t * rand;
    return vec2(cos(angle), sin(angle));
}


float Pseudo3dNoise(vec3 pos) {
    vec2 i = floor(pos.xy);
    vec2 f = pos.xy - i;
    vec2 blend = f * f * (3.0 - 2.0 * f);
    float noiseVal = 
        mix(
            mix(
                dot(GetGradient(i + vec2(0, 0), pos.z), f - vec2(0, 0)),
                dot(GetGradient(i + vec2(1, 0), pos.z), f - vec2(1, 0)),
                blend.x),
            mix(
                dot(GetGradient(i + vec2(0, 1), pos.z), f - vec2(0, 1)),
                dot(GetGradient(i + vec2(1, 1), pos.z), f - vec2(1, 1)),
                blend.x),
        blend.y
    );
    return noiseVal / 0.7; // normalize to about [-1..1]
}

vec3 lerp(vec3 colorone, vec3 colortwo,vec3 colortree,vec3 colorfour, float value)
{
    float b1 = 0.33;
    float b2 = 0.66;
    
    if(value<b1)
    {
        return (colorone + value*1.0/b1*(colortwo-colorone));
    }else if(value>b1 && value<b2){
        return (colortwo + (value-b1)*1.0/(b2-b1)*(colortree-colortwo));
    }else
    {
        return (colortree + (value-b2)*1.0/(1.0-b2)*(colorfour-colortree));
    }
}

void main() {
    float val = Pseudo3dNoise(0.4*vec3(vertexWorldPos.xy,vertexWorldPos.z+colorR));
    val = (val+1.0)/2.0;

    vec3 viewDirectionW = normalize(vCamPos - vPositionW);
    float fresnelTerm = 1.0-dot(viewDirectionW, vNormalW);
    fresnelTerm = clamp(1.0-fresnelTerm, 0., 1.);
    val = vertexPos.x*2.0+val*0.25;
    val = (val+0.5)/1.5;
    val = (val*fresnelTerm)*0.5+val*0.5;

 	vec3 Col1 = vec3(0.80265625, 0.15390625, 0.15390625);
    vec3 Col2 = vec3(1.00, 0.569, 0.098);
    vec3 Col3 = vec3(1.00, 0.757, 0.388);
    vec3 Col4 = vec3(1.00, 0.847, 0.796);
    vec3 col =  lerp(Col1,Col2,Col3,Col4,val);
    float dist = distance(MousePos,vertexWorldPos);
    if(dist<1.0)
    {
        gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    }
    else if (dist<1.25)
    {
      gl_FragColor = vec4(col,(dist-1.0)*4.0);
    }
    else
    {
        gl_FragColor = vec4(col,1.0);
    }
}
`
const WFS = `
precision mediump float;

uniform vec3 MousePos;
uniform vec3 ObjPos;
uniform float colorR;

varying vec3 vertexWorldPos;
varying vec3 vNormalW; 
varying vec3 vPositionW;
varying vec3 vertexPos;
varying vec3 vCamPos;

vec2 GetGradient(vec2 intPos, float t) {
    float rand = fract(sin(dot(intPos, vec2(12.9898, 78.233))) * 43758.5453);;
    
    // Rotate gradient: random starting rotation, random rotation rate
    float angle = 6.283185 * rand + 4.0 * t * rand; 
    return vec2(cos(angle), sin(angle));
}


float Pseudo3dNoise(vec3 pos) {
    vec2 i = floor(pos.xy);
    vec2 f = pos.xy - i;
    vec2 blend = f * f * (3.0 - 2.0 * f);
    float noiseVal = 
        mix(
            mix(
                dot(GetGradient(i + vec2(0, 0), pos.z), f - vec2(0, 0)),
                dot(GetGradient(i + vec2(1, 0), pos.z), f - vec2(1, 0)),
                blend.x),
            mix(
                dot(GetGradient(i + vec2(0, 1), pos.z), f - vec2(0, 1)),
                dot(GetGradient(i + vec2(1, 1), pos.z), f - vec2(1, 1)),
                blend.x),
        blend.y
    );
    return noiseVal / 0.7; // normalize to about [-1..1]
}

vec3 lerp(vec3 colorone, vec3 colortwo,vec3 colortree,vec3 colorfour, float value)
{
    float b1 = 0.33;
    float b2 = 0.66;
    
    if(value<b1)
    {
        return (colorone + value*1.0/b1*(colortwo-colorone));
    }else if(value>b1 && value<b2){
        return (colortwo + (value-b1)*1.0/(b2-b1)*(colortree-colortwo));
    }else
    {
        return (colortree + (value-b2)*1.0/(1.0-b2)*(colorfour-colortree));
    }
}

void main() {
    float val = Pseudo3dNoise(0.4*vec3(vertexWorldPos.xy,vertexWorldPos.z+colorR));
    val = (val+1.0)/2.0;

    vec3 viewDirectionW = normalize(vCamPos - vPositionW);
    float fresnelTerm = 1.0-dot(viewDirectionW, vNormalW);
    fresnelTerm = clamp(1.0-fresnelTerm, 0., 1.);
    val = vertexPos.x*2.0+val*0.25;
    val = (val+0.5)/1.5;
    val = (val*fresnelTerm)*0.5+val*0.5;

 	vec3 Col1 = vec3(0.80265625, 0.15390625, 0.15390625);
    vec3 Col2 = vec3(1.00, 0.569, 0.098);
    vec3 Col3 = vec3(1.00, 0.757, 0.388);
    vec3 Col4 = vec3(1.00, 0.847, 0.796);
    vec3 col =  lerp(Col1,Col2,Col3,Col4,val);
    float dist = distance(MousePos,vertexWorldPos);
    if (dist>1.25)
    {
      gl_FragColor = vec4(1.0,1.0,1.0,0.0);
    }
    else if(dist>1.0)
    {
        gl_FragColor = vec4(col,1.0-(dist-1.0)*4.0);
    }else{
        gl_FragColor = vec4(col,1.0);
    }
}
`
window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
userAgent = navigator.userAgent.toLowerCase();
isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

var isMobile = window.mobileAndTabletCheck() && !isTablet

if (!isMobile) {
    // Canvas
    const canvas = document.querySelector('canvas.webgl')
    let FileMap = new Map();
    let LazyLoad = [];
    
    const loader = new THREE.GLTFLoader();
    // Scene
    const scene = new THREE.Scene()

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let NewHeight = Math.max(window.innerHeight, 1200);
    function onPointerMove(event) {

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - ((event.clientY + document.documentElement.scrollTop) / NewHeight) * 2 + 1;
    }

    document.addEventListener('mousemove', (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - ((event.clientY + document.documentElement.scrollTop) / NewHeight) * 2 + 1;
    });

    window.addEventListener('pointermove', onPointerMove);

    
    class InteractableObject {
        constructor(pos, file, scale) {
            this.ColorRange = 0.0
            this.MousePos = new THREE.Vector3(0.0, 0.0, 0.0)
            this.uniforms = {
                MousePos: {
                    value: this.MousePos
                },
                ObjPos: {
                    value: pos
                },
                colorR: {
                    value: this.ColorRange
                },
                offset: {
                    value: 0.1
                }
            }
            const obj = this
            this.pos = pos
            this.scale = scale

            this.WFob = null
            this.ob = null
            this.vel = new THREE.Vector2(0.0, 0.0)

            this.IsJumpting = false
            this.InitPosz = pos.z
            if(FileMap.has(file))
            {
                if(FileMap.get(file))
                {
                    this.LoadObj(FileMap.get(file))
                }
                else
                {
                    LazyLoad.push([this,file])
                }
            }else{
                let FutObj = null
                FileMap.set(file,FutObj)

                loader.load(file, function (gltf) {
                    FutObj = gltf.scene.children[0].geometry
                    obj.LoadObj(gltf.scene.children[0].geometry)
                    for (let L of LazyLoad)
                    {   
                        if(L[1]==file)
                        {
                            L[0].LoadObj(gltf.scene.children[0].geometry)
                        }
                    }
                }, undefined, function (error) {
    
                    console.error(error);
    
                });
            }
            

        }
        LoadObj(ObjGeo)
        {
            this.wmaterial = new THREE.RawShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: VS,
                fragmentShader: WFS,
                //blending: THREE.AdditiveBlending,
                depthTest: false,
                depthWrite: false,
                transparent: true,
                vertexColors: true,
                wireframe: true,
                side: THREE.FrontSide
            });
    
            this.material = new THREE.RawShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: VS,
                fragmentShader: FS,
                side: THREE.FrontSide,
                transparent: true
            });
    
            this.ob = new THREE.Mesh(ObjGeo, this.material);
            this.WFob = new THREE.Mesh(ObjGeo, this.wmaterial);
    
            this.ob.position.set(this.pos.x, this.pos.y, this.pos.z)
            this.WFob.position.set(this.pos.x, this.pos.y, this.pos.z)
    
            this.ob.scale.set(this.scale.x, this.scale.y, this.scale.z)
            this.WFob.scale.set(this.scale.x, this.scale.y, this.scale.z)
    
            scene.add(this.WFob)
            scene.add(this.ob)
            RecalcLoc()
        }
        Update(deltaTime) {

            if (this.ob && this.WFob) {
                this.ob.rotation.z = -pointer.x / 3
                this.WFob.rotation.z = this.ob.rotation.z
                this.ob.rotation.x = -pointer.y / 3
                this.WFob.rotation.x = this.ob.rotation.x
            }
            if (this.IsJumpting) {
                this.ob.position.z += this.vel.y
                this.WFob.position.z = this.ob.position.z
                this.vel.y += 0.981 * deltaTime
                if (this.ob.position.z > this.InitPosz) {
                    this.vel.y = -this.vel.y / 2.0
                    if (Math.abs(this.vel.y) < 0.02) {
                        this.IsJumpting = false
                    }
                }
            }
            this.uniforms.colorR.value += deltaTime
        }
        Jump() {
            if (!this.IsJumpting) {
                this.IsJumpting = true
                this.vel.y = -0.2
            }
        }
    }

    let scale = 4
    let logo = new InteractableObject(new THREE.Vector3(-20, 0.0, 8), 'https://lennertvloeberghs.github.io/Accelerate/website/3D/logo.glb', new THREE.Vector3(scale, scale, scale))
    let logo2 = new InteractableObject(new THREE.Vector3(21, 0.0, 22), 'https://lennertvloeberghs.github.io/Accelerate/website/3D/logo.glb', new THREE.Vector3(scale * 0.8, scale * 0.8, scale * 0.8))

    /**
     * Sizes
         */
    const sizes = {
        width: window.innerWidth,
        height: NewHeight
    }
    RecalcLoc()
    let CamScale = 60
    function RecalcLoc() {
        if (!logo2.ob || !logo2.WFob||!logo.ob || !logo.WFob) {

            return
        }
        if (sizes.width > 1440) {
            logo.ob.position.x = -20
            logo.WFob.position.x = -20
            logo2.ob.position.x = 21
            logo2.WFob.position.x = 21
            logo2.ob.position.z = 22
            logo2.WFob.position.z = 22
            logo2.InitPosz = 22
        }
        if (sizes.width < 1440) {
            logo.ob.position.x = -19 * sizes.width / 1440
            logo.WFob.position.x = -19 * sizes.width / 1440
            logo2.ob.position.x = 20 * sizes.width / 1440
            logo2.WFob.position.x = 20 * sizes.width / 1440
            logo2.ob.position.z = 22
            logo2.WFob.position.z = 22
            logo2.InitPosz = 22

        } if (sizes.width < 990) {
            logo.ob.position.x = -2000
            logo.WFob.position.x = -2000
            logo2.ob.position.x = 12 * sizes.width / 990
            logo2.WFob.position.x = 12 * sizes.width / 990
            logo2.ob.position.z = 18.5 - 3.5 * sizes.width / 990
            logo2.WFob.position.z = 18.5 - 3.5 * sizes.width / 990
            logo2.InitPosz = 18.5 - 3.5 * sizes.width / 990
        }
    }
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = Math.max(window.innerHeight, 1200);
        RecalcLoc()
        // Update camera
        //camera.aspect = sizes.width / sizes.height
        camera.left = sizes.width / - CamScale
        camera.right = sizes.width / CamScale
        camera.top = 0
        camera.bottom = sizes.height / - CamScale * 2

        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(2)
    })

    /**
     * Camera
     */
    // Base camera
    //const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 1000)
    const camera = new THREE.OrthographicCamera(sizes.width / - CamScale, sizes.width / CamScale, 0, sizes.height / - CamScale * 2, 1, 10000);


    camera.position.y = 50
    camera.rotation.x = -1.570796

    scene.add(camera)

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas, alpha: true, antialiasing: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(2)
    renderer.setClearColor(0x000000, 0);
    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let prefTime = 0

    addEventListener('click', (event) => {
        raycaster.setFromCamera(pointer, camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            if (intersects[0].object == logo.ob || intersects[0].object == logo.WFob) {
                logo.Jump()
            } else {
                logo2.Jump()
            }
        }

    });
    $htlm = $('html')
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        let deltaTime = elapsedTime - prefTime
        prefTime = elapsedTime
        raycaster.setFromCamera(pointer, camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            //logo.uniforms.MousePos.value = intersects[0].point;
            //logo2.uniforms.MousePos.value = intersects[0].point;
            $htlm.css('cursor', 'pointer');
        } else {
            $htlm.css('cursor', 'auto');
            //var vector = new THREE.Vector3(pointer.x, pointer.y, -1).unproject(camera);
            //logo.uniforms.MousePos.value = new THREE.Vector3(vector.x, 0, vector.z);
            //logo2.uniforms.MousePos.value = new THREE.Vector3(vector.x, 0, vector.z);
        }


        logo.Update(deltaTime)
        logo2.Update(deltaTime)
        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}
