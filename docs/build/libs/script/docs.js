$(function() {

  docsMenu('docH2');

  document.getElementById('toggleCode').onclick = function() { 
    toggleDoc('hideCode');
  };

  document.getElementById('toggleDesignNotes').onclick = function() { 
    toggleDoc('hideDesignNotes');
  };
});


//Cross browser for scrolling detection. Uncomment this if you want to have menu that sticks to top of viewport
/*function getScrollTop(){
  if(typeof pageYOffset!= 'undefined'){
      //most browsers
      return pageYOffset;
  }
  else{
      var B= document.body; //IE 'quirks'
      var D= document.documentElement; //IE with doctype
      D= (D.clientHeight)? D: B;
      return D.scrollTop;
  }
}*/

//Generate docs menu
var docsMenu = function(classname) {

  var headings = document.getElementsByClassName(classname),
      nav = document.getElementsByClassName('docNav')[0];

    headings = Array.prototype.slice.call(headings).sort(function(a,b) {
        return a.innerHTML < b.innerHTML ? -1 : 1;
    });

  for (var i=0; i<headings.length; i++) {
    var id = headings[i].getAttribute('id'),
        componentName = headings[i].innerHTML,
        navItem = '<li><a href="#' + id + '">' + componentName + '</a></li>';

    nav.innerHTML += (navItem);
  }

  //Make nav stick to top of viewport when scrolling. Uncomment this if you want to have menu that sticks to top of viewport
  /*window.addEventListener('scroll', function() {
     if (getScrollTop() > nav.offsetTop) {
        nav.classList.add("docNavFixed");
     } else {
        nav.classList.remove("docNavFixed");
     }
  });*/

}

//Toggle
var toggleDoc = function(classname) {
    var html = document.documentElement,
        classRe = new RegExp("(^|\\s)"+classname+"(\\s|$)",'g');

    //toggle the css class
    if(classRe.test(html.className)) {
        html.className = html.className.replace(classRe,'');
    } else { 
        html.className+= ' '+ classname;
    }
};
