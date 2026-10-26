import math, random
S=32; OX=830; OY=372
def P(x,y,z=0): return (OX+(x-y)*0.8660254*S, OY+((x+y)*0.5-z)*S)
def f(v): return ('%.1f'%v).rstrip('0').rstrip('.')
class Sc:
    def __init__(s): s.o=[]; s.d=0.15
    def dl(s):
        s.d=min(s.d+0.03,1.7); return s.d
    def path(s,pts,cls='',style='',close=True,extra=''):
        d='M'+'L'.join(f(a)+' '+f(b) for a,b in pts)+('Z' if close else '')
        s.o.append('<path pathLength="1" class="dr %s" style="animation-delay:%.2fs;animation-duration:1.1s;%s" %s d="%s"/>'%(cls,s.dl(),style,extra,d))
    def box(s,x0,y0,z0,x1,y1,z1,top='t',fill=''):
        st=fill
        s.path([P(x1,y0,z0),P(x1,y1,z0),P(x1,y1,z1),P(x1,y0,z1)],'b',st)
        s.path([P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)],'b',st)
        s.path([P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)],top,st)
    def line(s,a,b,cls='t'): s.path([a,b],cls,close=False)
    def raw(s,t): s.o.append(t)
    def disc(s,x,y,z0,R,h,top='c',fill=''):
        rx=1.2247*R*S; ry=0.7071*R*S
        cx,cy=P(x,y,z0); cy2=cy-h*S
        s.raw('<path pathLength="1" class="dr b" style="animation-delay:%.2fs;animation-duration:1.1s;%s" d="M%s %sA%s %s 0 0 0 %s %sL%s %sA%s %s 0 0 1 %s %sZ"/>'%(s.dl(),fill,f(cx-rx),f(cy),f(rx),f(ry),f(cx+rx),f(cy),f(cx+rx),f(cy2),f(rx),f(ry),f(cx-rx),f(cy2)))
        s.raw('<ellipse pathLength="1" class="dr %s" style="animation-delay:%.2fs;animation-duration:1.1s;%s" cx="%s" cy="%s" rx="%s" ry="%s"/>'%(top,s.dl(),fill,f(cx),f(cy2),f(rx),f(ry)))
    def sphere(s,x,y,z,R,cls='g'):
        cx,cy=P(x,y,z); r=1.2247*R*S
        s.raw('<circle pathLength="1" class="dr %s" style="animation-delay:%.2fs;animation-duration:1.1s" cx="%s" cy="%s" r="%s"/>'%(cls,s.dl(),f(cx),f(cy),f(r)))
    def text(s,x,y,z,t,size=9,cls='sl',anchor='middle'):
        px,py=P(x,y,z)
        s.raw('<text class="%s" x="%s" y="%s" font-size="%s" text-anchor="%s">%s</text>'%(cls,f(px),f(py),size,anchor,t))
    def person(s,pts,dur,begin,fill='#F1EEE8'):
        d='M'+'L'.join(f(a)+' '+f(b) for a,b in [P(*p) for p in pts])+'Z'
        col='url(#lgc)' if int(begin)%2==0 else '#F1EEE8'
        s.raw('<g><g class="pw"><ellipse cx="0" cy="1" rx="6" ry="2.4" fill="#000" fill-opacity=".5"/><rect x="-3.6" y="-13" width="7.2" height="12" rx="3.4" fill="%s" stroke="#07090B" stroke-width="1"/><circle cy="-17" r="4" fill="#F1EEE8" stroke="#07090B" stroke-width="1"/><path d="M-2.4 -17.6h4.8" stroke="#07090B" stroke-width="1.6" stroke-linecap="round"/></g><animateMotion dur="%ss" begin="-%ss" repeatCount="indefinite" path="%s"/></g>'%(col,dur,begin,d))
    def stand(s,x,y,col=0,look=0):
        px,py=P(x,y,0)
        c='url(#lgc)' if col==0 else '#F1EEE8'
        s.raw('<g transform="translate(%s %s)"><g class="pw" style="animation-delay:%.2fs"><ellipse cx="0" cy="1" rx="6" ry="2.4" fill="#000" fill-opacity=".5"/><rect x="-3.6" y="-13" width="7.2" height="12" rx="3.4" fill="%s" stroke="#07090B" stroke-width="1"/><circle cy="-17" r="4" fill="#F1EEE8" stroke="#07090B" stroke-width="1"/><path d="M%s -17.6h2.6" stroke="#07090B" stroke-width="1.6" stroke-linecap="round"/></g></g>'%(f(px),f(py),(x*7%10)/10,c,'-1' if look==0 else '-3.6'))
    def sit(s,x,y,col=0,look=0):
        px,py=P(x,y,.45)
        c='url(#lgc)' if col==0 else '#F1EEE8'
        s.raw('<g transform="translate(%s %s)"><g class="pw" style="animation-delay:%.2fs"><rect x="-3.6" y="-10" width="7.2" height="9" rx="3.4" fill="%s" stroke="#07090B" stroke-width="1"/><circle cy="-14" r="4" fill="#F1EEE8" stroke="#07090B" stroke-width="1"/><path d="M%s -14.6h2.6" stroke="#07090B" stroke-width="1.6" stroke-linecap="round"/></g></g>'%(f(px),f(py),(y*5%10)/10,c,'-1' if look==0 else '-3.6'))
    def bubble(s,x,y,z,d=0):
        px,py=P(x,y,z)
        s.raw('<g transform="translate(%s %s)"><g class="bobb" style="animation-delay:%.1fs"><path d="M-14 -10h28a5 5 0 015 5v8a5 5 0 01-5 5h-18l-6 6v-6h-4a5 5 0 01-5-5v-8a5 5 0 015-5z" fill="#07090B" stroke="url(#lgc)" stroke-width="1.2"/><circle cx="-6" cy="-1" r="1.8" class="tp" style="animation-delay:0s" fill="#F1EEE8"/><circle cx="0" cy="-1" r="1.8" class="tp" style="animation-delay:.25s" fill="#F1EEE8"/><circle cx="6" cy="-1" r="1.8" class="tp" style="animation-delay:.5s" fill="#F1EEE8"/></g></g>'%(f(px),f(py),d))
    def packet(s,pts,dur,begin):
        d='M'+'L'.join(f(a)+' '+f(b) for a,b in pts)
        s.raw('<circle r="3.2" fill="#C58AF9" style="filter:drop-shadow(0 0 4px #A855F7)"><animateMotion dur="%ss" begin="%ss" repeatCount="indefinite" path="%s"/></circle>'%(dur,begin,d))
    def glow(s,x,y,rx=150,ry=70):
        px,py=P(x,y,0)
        s.raw('<ellipse cx="%s" cy="%s" rx="%d" ry="%d" fill="url(#gl)" fill-opacity=".28" style="filter:blur(14px)"/>'%(f(px),f(py),rx,ry))
    def dash(s,a,b):
        s.raw('<path class="dsh2" d="M%s %sL%s %s"/>'%(f(a[0]),f(a[1]),f(b[0]),f(b[1])))
    def shell(s):
        s.box(0,0,-.5,10,7,0,'b')
        s.path([P(i,0),P(i,7)],'t',close=False) if False else None
        for i in range(1,10): s.line(P(i,0,0),P(i,7,0))
        for j in range(1,7): s.line(P(0,j,0),P(10,j,0))
        s.box(0,0,0,.3,7,2.4,'a'); s.box(.3,0,0,10,.3,2.4,'a')
C=['{{c1}}','{{c2}}','{{c3}}']
def fl(i,op=.55): return 'fill:%s;fill-opacity:%s;'%(C[i%3],op)
def sticky(s,x,z,i):
    a=P(x,.3,z);b=P(x+.7,.3,z);c=P(x+.7,.3,z+.6);d=P(x,.3,z+.6)
    s.path([a,b,c,d],'c',fl(i,.75))

def scene(n):
    s=Sc(); anchors=[]; people=[]
    A=lambda x,y,z:anchors.append(P(x,y,z))
    s.glow(*{1:(5.4,3),2:(6.4,3.7),3:(5,2.5),4:(5,2),5:(7.4,1.5),6:(6.6,3.6),7:(5.2,2.4),8:(5,3.4)}[n])
    if n==1:
        for i,(x,z) in enumerate([(1,1.2),(2.1,1.7),(3.4,1.1),(5.2,1.6),(6.6,1.2),(7.9,1.8)]): sticky(s,x,z,i)
        s.box(3.2,2.4,0,7.6,3.6,.8,'c',fl(1,.25))
        for x in (3.8,5.2,6.6): s.box(x,4.1,0,x+.6,4.7,.45,'c',fl(0,.5))
        s.stand(2.8,1.5,0,1); s.sit(4.1,4.4,0); s.sit(5.5,4.4,1,1)
        s.bubble(2.8,1.5,1.25)
        A(5.2,.3,1.9); A(5.4,3.0,.8); A(6.9,4.4,.45); A(2.0,.3,1.4)
        people=[([(1,5.6,0),(9,5.6,0),(9,6.4,0),(1,6.4,0)],20,3)]
    if n==2:
        for i,h in enumerate([.8,1.4,1.1,2.0,1.6]): s.box(1+i*1.25,.6,0,1.9+i*1.25,1.5,h,'c',fl(i,.6))
        s.box(5.2,3.2,0,7.6,4.2,.75,'t')
        s.disc(6.4,3.7,.75,.28,.05,'g')
        s.sit(5.2,3.0,0); s.sit(7.1,3.0,1,1)
        s.stand(2.2,2.8,1); s.box(1,3.6,0,3.4,4.6,.8,'t'); s.box(1.7,3.7,.8,2.8,3.9,1.7,'c',fl(2,.5))
        s.bubble(5.2,3.0,1.3); s.bubble(7.1,3.0,1.3,.9)
        A(6.4,3.7,.8); A(2.2,3.8,1.7); A(4.4,1.5,2.0)
        people=[([(1,5.6,0),(9,5.6,0),(9,6.4,0),(1,6.4,0)],18,2)]
    if n==3:
        nodes=[(1.4,1.2,'Journey'),(4.4,1.2,'Features'),(7.4,1.2,'MVP'),(4.4,3.4,'Roadmap'),(7.4,3.4,'Metrics')]
        cs=[P(x+.7,y+.5,.3) for x,y,_ in nodes]
        for a,b in [(0,1),(1,2),(1,3),(3,4),(2,4)]: s.dash(cs[a],cs[b])
        for i,(x,y,t_) in enumerate(nodes):
            s.box(x,y,0,x+1.4,y+1.0,.25,'a' if i==2 else 'c',fl(i,.5 if i!=2 else .85))
            s.text(x+.7,y+.5,.5,t_,8.5)
        s.box(1.2,3.6,1.0,2.4,4.8,2.2,'g',fl(1,.35))
        s.stand(3.2,4.9,0); s.stand(2.2,5.4,1,1)
        s.packet([P(2.1,1.7,.3),P(5.1,1.7,.3),P(8.1,1.7,.3)],4,0); s.packet([P(5.1,1.7,.3),P(5.1,3.9,.3),P(8.1,3.9,.3)],4,1.5)
        A(2.1,1.7,.25); A(5.1,1.7,.25); A(8.1,1.7,.25); A(5.1,3.9,.25)
        # walker between nodes
        people=[([(2.1,1.7,0),(5.1,1.7,0),(5.1,3.9,0),(8.1,3.9,0),(8.1,1.7,0),(5.1,1.7,0),(5.1,3.9,0),(2.1,3.9,0)],26,6)]
    if n==4:
        for i,x in enumerate((1.0,3.9,6.8)):
            s.box(x,1.1,.5,x+2.2,1.25,2.7,'c',fl(i,.3)); s.box(x+.9,1.0,0,x+1.3,1.3,.5,'t')
            y=1.25
            for (a,b,c_,d_) in [(.2,.4,2.0,.9),(.2,1.1,.9,1.7),(1.1,1.1,2.0,1.7),(.2,1.9,2.0,2.2)]:
                s.path([P(x+a,y,.5+b+.1),P(x+c_,y,.5+b+.1),P(x+c_,y,.5+d_),P(x+a,y,.5+d_)],'t')
        for x in (3.2,6.1): s.dash(P(x,2.4,.05),P(x+.9,2.4,.05))
        s.stand(2.6,3.1,0); s.stand(5.5,3.2,1,1)
        s.packet([P(3.2,2.4,.1),P(7.0,2.4,.1)],3,0)
        A(5.0,2.4,.05); A(2.1,1.25,2.2); A(8.0,1.25,2.2)
        people=[([(1,4.8,0),(9,4.8,0),(9,6.4,0),(1,6.4,0)],20,4)]
    if n==5:
        for i in range(3): s.box(1.4+i*1.5,3.2,0,2.6+i*1.5,4.4,.35,'c',fl(i,.8))
        s.box(5.6,.6,.0,9.4,.9,2.3,'c',fl(1,.25))
        for (a,b,c_,d_,k) in [(.3,1.5,3.5,2.0,0),(.3,.4,1.7,1.2,1),(1.9,.4,3.5,1.2,2)]:
            s.path([P(5.6+a,.9,b+.2),P(5.6+c_,.9,b+.2),P(5.6+c_,.9,d_+.3),P(5.6+a,.9,d_+.3)],'c',fl(k,.55))
        s.stand(3.2,2.6,0); s.stand(7.4,2.2,1,1)
        A(2.0,3.8,.35); A(7.4,.9,1.9); A(4.9,3.8,.35)
        people=[([(1,5.4,0),(9,5.4,0),(9,6.4,0),(1,6.4,0)],18,5)]
    if n==6:
        for i in range(3):
            s.box(1+i*1.35,.6,0,2.1+i*1.35,1.6,2.3,'t')
            for k in range(4): s.path([P(1.15+i*1.35,1.6,.3+k*.5),P(1.9+i*1.35,1.6,.3+k*.5)],'a' if k==1 else 't',close=False)
        s.disc(6.6,3.6,0,1.5,.35,'t')
        for k in (0,1,2): s.dash(P(2+k*1.35,1.6,1.2),P(6.6,3.6,1.9))
        s.sphere(6.6,3.6,2.1,.9,'g')
        cx,cy=P(6.6,3.6,2.1)
        s.raw('<ellipse class="orb" cx="%s" cy="%s" rx="62" ry="22"/>'%(f(cx),f(cy)))
        s.raw('<ellipse class="orb o2" cx="%s" cy="%s" rx="84" ry="30"/>'%(f(cx),f(cy)))
        s.stand(4.4,4.8,0); s.stand(8.4,5.2,1,1)
        for k in (0,1,2): s.packet([P(2+k*1.35,1.6,1.2),P(6.6,3.6,1.9)],2.6,k*.8)
        A(2.0,1.6,2.0); A(4.3,2.7,1.5); A(6.6,3.6,3.0)
        people=[([(1,5.8,0),(9,5.8,0),(9,6.5,0),(1,6.5,0)],17,2)]
    if n==7:
        s.box(4.2,1.8,0,6.2,2.4,.45,'t')
        s.box(4.5,1.95,.45,5.9,2.15,3.1,'c',fl(2,.25))
        for (a,b,c_,d_,k) in [(.2,.2,1.2,1.0,0),(.2,1.2,1.2,1.5,1),(.2,1.7,1.2,2.4,2)]:
            s.path([P(4.5+a,2.15,.45+b),P(4.5+c_,2.15,.45+b),P(4.5+c_,2.15,.45+d_),P(4.5+a,2.15,.45+d_)],'c',fl(k,.7))
        s.raw('<g class="scan"><path d="M%s %sL%s %s" stroke="#C58AF9" stroke-width="2"/></g>'%(f(P(4.5,2.15,.5)[0]),f(P(4.5,2.15,.5)[1]),f(P(5.9,2.15,.5)[0]),f(P(5.9,2.15,.5)[1])))
        s.box(1.0,3.8,0,4.2,5.0,.8,'t'); s.box(1.5,3.9,.8,3.2,4.7,.88,'c',fl(1,.5))
        s.box(7.4,3.2,0,9.0,4.4,.55,'c',fl(0,.4))
        s.sit(2.2,5.2,0); s.stand(5.4,3.4,1,1)
        s.bubble(5.4,3.4,1.3)
        A(5.2,2.15,2.8); A(5.4,3.4,.9); A(8.2,3.8,.55)
        people=[([(1,5.8,0),(9,5.8,0),(9,6.5,0),(1,6.5,0)],17,2)]
    if n==8:
        s.disc(5,3.4,0,2.3,.25,'c',fl(1,.3))
        s.box(4.3,2.7,.25,5.7,4.1,3.0,'t')
        ap=P(5,3.4,4.6)
        s.path([P(5.7,2.7,3.0),P(5.7,4.1,3.0),ap],'c',fl(0,.7))
        s.path([P(4.3,4.1,3.0),P(5.7,4.1,3.0),ap],'c',fl(2,.7))
        s.box(5.7,4.1,.25,6.5,4.5,.9,'t'); s.box(3.5,4.1,.25,4.3,4.5,.9,'t')
        fx,fy=P(5,3.4,.2)
        s.raw('<ellipse class="burn" cx="%s" cy="%s" rx="46" ry="16" fill="url(#gl)"/>'%(f(fx),f(fy)))
        s.stand(8.2,2.0,0); s.stand(2.0,2.6,1,1); s.box(1.2,3.4,0,2.4,4.4,.8,'t')
        s.bubble(8.2,2.0,1.3)
        A(5.0,3.4,4.6); A(1.8,3.9,.8); A(8.0,3.0,.4)
        people=[([(1,5.6,0),(9,5.6,0),(9,6.5,0),(1,6.5,0)],19,4)]
    for pts,dur,b in people: s.person(pts,dur,b)
    s.raw('<rect class="cut" x="590" y="250" width="560" height="3" fill="url(#lgc)"/>')
    return '\n'.join(s.o), anchors
def shell():
    s=Sc(); s.shell(); return '\n'.join(s.o)
