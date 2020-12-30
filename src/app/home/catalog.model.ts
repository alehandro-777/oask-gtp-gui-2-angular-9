export class ProductsPage {
    data:Product[];
    total_count:number;
    link: Link;
}

export class ProductsCategoryPage {
    data:ProductCategory[];
    total_count:number;
    link: Link;
}

export class Link {
    page:number;
    per_page:number;
    prev:number;
    next:number;
    last:number;
}

export class Product {
    _id: string;
    name:string;
    description:string;
    category:string;
    price:number;
    image_uri:string;
    enabled:boolean;
    created_at: Date;
    constructor(){
      this.name = 'Product N';
      this.description = 'Product N description ';
      this.price = 1000;
      this.enabled = true;
      this.category  = 'category1';
    }
}

export class ProductCategory {
    _id: string;
    name: string;
    description: string;
    cat_uri: string;
}

