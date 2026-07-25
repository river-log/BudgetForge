function CardHeader({ children, className = "", ...props }) {
  return <header className={`bf-card__header ${className}`.trim()} {...props}>{children}</header>;
}

function CardTitle({ children, className = "", ...props }) {
  return <h2 className={`bf-card__title ${className}`.trim()} {...props}>{children}</h2>;
}

function CardDescription({ children, className = "", ...props }) {
  return <p className={`bf-card__description ${className}`.trim()} {...props}>{children}</p>;
}

function CardContent({ children, className = "", ...props }) {
  return <div className={`bf-card__content ${className}`.trim()} {...props}>{children}</div>;
}

function CardFooter({ children, className = "", ...props }) {
  return <footer className={`bf-card__footer ${className}`.trim()} {...props}>{children}</footer>;
}

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
