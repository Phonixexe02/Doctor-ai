// main.js

document.addEventListener("DOMContentLoaded",()=>{
  const sidebar=document.getElementById("sidebar");
  const overlay=document.getElementById("overlay");
  const sidebarToggle=document.getElementById("sidebarToggle");
  const themeToggle=document.getElementById("themeToggle");
  const themeLabel=document.getElementById("themeLabel");
  const content=document.getElementById("content");

  function openSidebar(){
    sidebar.classList.add("overlay-open");
    overlay.classList.add("show");
    content.classList.add("blurred");
  }
  function closeSidebar(){
    sidebar.classList.remove("overlay-open");
    overlay.classList.remove("show");
    content.classList.remove("blurred");
  }

  sidebarToggle.addEventListener("click",()=>{
    if(window.matchMedia("(max-width:900px)").matches){
      if(sidebar.classList.contains("overlay-open")){
        closeSidebar();
      }else{
        openSidebar();
      }
    }else{
      sidebar.classList.toggle("collapsed");
    }
  });

  overlay.addEventListener("click",closeSidebar);
  window.addEventListener("resize",()=>{
    if(!window.matchMedia("(max-width:900px)").matches){
      overlay.classList.remove("show");
      sidebar.classList.remove("overlay-open");
      content.classList.remove("blurred");
    }
  });

  themeToggle.addEventListener("change",()=>{
    const mode=themeToggle.checked?"dark":"light";
    document.documentElement.setAttribute("data-theme",mode);
    themeLabel.textContent=mode==="dark"?"Dark":"Light";
  });
});