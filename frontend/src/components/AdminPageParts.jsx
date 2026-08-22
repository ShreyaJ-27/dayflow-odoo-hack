export function PageHeader({ eyebrow, title, copy, action }) {
  return <div className="content-heading page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="heading-copy">{copy}</p></div>{action}</div>
}

export function SearchInput({ value, onChange, placeholder }) {
  return <label className="table-search"><span className="search-mark">?</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>
}