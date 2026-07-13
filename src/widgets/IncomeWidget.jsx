function IncomeWidget({income}){

return(

<div className="widget">

<h3>💰 Monthly Income</h3>

<h1>

{income.toLocaleString("en-US",{

style:"currency",

currency:"USD"

})}

</h1>

<p>

Available this month

</p>

</div>

);

}

export default IncomeWidget;