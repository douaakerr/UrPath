import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead, deleteNotification } from "../../services/notificationService";
import "../../style/notifications.css";

function Notifications() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=()=>getNotifications().then(r=>setItems(r?.notifications||r?.data?.notifications||[])).catch(e=>setError(e.response?.data?.message||"Unable to load notifications.")).finally(()=>setLoading(false));
  useEffect(()=>{load()},[]);
  const read=async(id)=>{await markNotificationAsRead(id);setItems(v=>v.map(n=>n._id===id?{...n,isRead:true,read:true}:n))};
  const readAll=async()=>{await markAllNotificationsAsRead();setItems(v=>v.map(n=>({...n,isRead:true,read:true})))};
  const remove=async(id)=>{await deleteNotification(id);setItems(v=>v.filter(n=>n._id!==id))};
  return <main className="notifications-page"><header><span>STAY ON TRACK</span><h1>Notifications</h1><p>Updates and reminders from your learning journey.</p></header>{loading?<div className="progress-state">Loading notifications...</div>:error?<div className="progress-state progress-state--error">{error}</div>:<section className="notifications-card"><div className="notifications-toolbar"><strong>{items.length} notifications</strong>{items.some(n=>!(n.isRead??n.read))&&<button onClick={readAll}><Check size={15}/> Mark all read</button>}</div>{items.length===0?<div className="notifications-empty"><Bell size={28}/><h2>You're all caught up</h2><p>New reminders will appear here.</p></div>:items.map(n=><article className={`notification-row ${(n.isRead??n.read)?"notification-row--read":""}`} key={n._id}><div className="notification-icon"><Bell size={17}/></div><div><h2>{n.title||"UrPath update"}</h2><p>{n.message||n.content||""}</p><small>{n.createdAt?new Date(n.createdAt).toLocaleString():""}</small></div><div className="notification-actions">{!(n.isRead??n.read)&&<button onClick={()=>read(n._id)} aria-label="Mark as read"><Check size={15}/></button>}<button onClick={()=>remove(n._id)} aria-label="Delete"><Trash2 size={15}/></button></div></article>)}</section>}</main>;
}
export default Notifications;
