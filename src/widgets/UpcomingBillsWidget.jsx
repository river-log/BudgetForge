function UpcomingBillsWidget({bills}){

const upcoming=[...bills]

.filter(b=>!b.paid)

.sort((a,b)=>

new Date(a.dueDate)-new Date(b.dueDate)

)

.slice(0,5);

return(

<div className="widget">

<h3>📅 Upcoming Bills</h3>

{

upcoming.length===0?

<p>Nothing due 🎉</p>

:

upcoming.map(b=>

<div

className="upcoming-row"

key={b.id}

>

<div>

<strong>

{b.name}

</strong>

<br/>

<small>

{b.dueDate}

</small>

</div>

<div>

${b.amount}

</div>

</div>

)

}

</div>

);

}

export default UpcomingBillsWidget;