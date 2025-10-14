import { FCC } from '@cmrc/types/FCC';

interface LabelProps {
  name?: string;
  label?: string;
  type?: string;
  size?: 'big' | 'default';
  color?: string;
}

const Label: FCC<LabelProps> = (props) => {
  const style = {
    fontWeight: 600,
    marginLeft: '3px',
    fontSize: props.size === 'big' ? '1.5rem' : '0.875rem',
    marginBottom: '0',
    color: props.color ? props.color : '#8a8f9f'
  };

  return (
    <div style={style}>
      <label
        htmlFor={props.name}
        dangerouslySetInnerHTML={props.label && { __html: props.label }}
      >
        {props.children}
      </label>
    </div>
  );
};

export default Label;
