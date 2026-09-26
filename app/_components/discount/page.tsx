type propsDiscount={
    price: number;
    priceAfterDiscount:number;
}
export default function Discount({price,priceAfterDiscount}:propsDiscount){

const discountPercent = Math.round(((price - priceAfterDiscount) / price) * 100);
if (!priceAfterDiscount || priceAfterDiscount >= price) return null;
return(
<span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
      {discountPercent}% OFF
    </span>
)
}