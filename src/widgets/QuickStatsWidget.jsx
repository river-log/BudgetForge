function QuickStatsWidget({bills}){

const paid=bills.filter(b=>b.paid).length;

const unpaid=bills.length-paid;

const overdue=bills.filter(b=>{

if(b.paid) return false;

return new Date(b.dueDate)<new Date();

}).length;

return(

<div className="widget">

<h3>📊 Quick Stats</h3>

<p>Total Bills: {bills.length}</p>

<p>Paid: {paid}</p>

<p>Unpaid: {unpaid}</p>

<p>Overdue: {overdue}</p>

</div>

);

}

export default QuickStatsWidget;