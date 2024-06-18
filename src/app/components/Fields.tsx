interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  type = 'text',
  autoComplete,
  required,
  value,
  onChange,
  className = '',
  ...props
}) => (
  <div className={`textfield-container ${className}`}>
    <label htmlFor={name} className="textfield-label">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={required}
      value={value}
      onChange={onChange}
      className="textfield-input"
      {...props}
    />
  </div>
);

export default TextField;
