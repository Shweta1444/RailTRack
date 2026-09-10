function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  type = "",
}) {
  return (
    <div className={`statCard ${type}`}>
      <div className="statIcon">
        {Icon && <Icon size={22} />}
      </div>

      <div className="statContent">
        <span>{title}</span>

        <strong>{value}</strong>

        {subtitle && (
          <small>{subtitle}</small>
        )}
      </div>
    </div>
  );
}

export default StatCard;