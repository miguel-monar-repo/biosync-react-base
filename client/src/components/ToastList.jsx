import Icon from './Icon.jsx'
import './ToastList.css'

function ToastList({ toasts }) {
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast${t.leaving ? ' leaving' : ''}`}>
          <span className="t-ico">
            <Icon name={t.icon} />
          </span>
          <div>
            <b>{t.title}</b>
            <span>{t.body}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastList
