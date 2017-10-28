class Page {
  constructor(content, limit = 5) {
    this.content = content;
    this.limit = limit;
    this.currentPage = 1;
  }

  showContent() {
    return this.content.offset(this.limit*(this.currentPage-1) ).max(this.limit);
  }
  nextPage() {
    if (this.content.offset(this.limit*((this.currentPage+1)-1) ).max(this.limit).length !== 0) {
      this.currentPage = this.currentPage+1;
    }
    return this.content.offset(this.limit*(this.currentPage-1) ).max(this.limit);
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage = this.currentPage-1;
    }
    return this.content.offset(this.limit*(this.currentPage-1) ).max(this.limit);
  }
  isPageNextExist() {
    if (this.content.offset(this.limit*((this.currentPage+1)-1) ).max(this.limit).length !== 0) {
      return true;
    } else {
      return false
    }
  }
  isPagePrevExist() {
    if (this.currentPage !== 1) {
      return true;
    } else {
      return false;
    }
  }

}

Array.prototype.max = function(mx) {
   return this.filter(function(e,i){return i < mx;}); }
};

Array.prototype.offset = function(os) {
  return this.filter(function(e,i){return i> os-1 });
};
var z = new Page([{a: 1}, {a: 2}, {a: 3}, {a:4}, {a:5}, {a:6}, {a: 7}, {a:8}, {a: 9}, {a: 10}])

//export default (content) => { new Page(content) }