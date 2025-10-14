import { SxProps } from '@mui/material';

import { Editor } from '@tinymce/tinymce-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormLabel from '@mui/material/FormLabel';
import { FCC } from '@cmrc/types/FCC';

export type FGQuillEditorProps = {
  name?: string;
  value?: string;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  obfuscable?: boolean;
  placeholder?: string;
  label?: string;
  sx?: SxProps;
  onChange?: any;
};
const MyEditor: FCC<FGQuillEditorProps> = ({
  label,
  obfuscable,
  sx,
  required,
  ...props
}) => {
  const [val, setValue] = useState(props.value);

  useEffect(() => {
    if (val !== props.value) props.onChange(val);
  }, [val]);

  useEffect(() => {
    if (obfuscable) disableEditor();
  }, [props.readonly, obfuscable]);

  const ref = useRef(null);

  function listenHandler(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  const disableEditor = () => {
    ref?.current?.editor
      ?.getBody()
      ?.addEventListener('keydown', listenHandler, false);
  };

  const SETTINGS = {
    DEFAULT: {
      menubar: 'edit view format tools table',
      plugins: [
        'table',
        'lists',
        'searchreplace',
        'link',
        'autolink',
        'fullscreen'
      ],
      contextmenu: 'link bold italic',
      toolbar:
        'fontsize | bold italic link | undo redo | numlist bullist | outdent indent | tableprops tablemergecells tablesplitcells | removeformat | fullscreen',

      menu: {
        table: {
          title: 'Tabella',
          items:
            'inserttable | tablemergecells tablesplitcells row column | advtablesort | tableprops deletetable'
        }
      }
    },
    OBFUSCALBE: {
      menubar: false,
      plugins: [],
      contextmenu: 'strikethrough',
      toolbar: ' strikethrough'
    }
  };

  return (
    <MUIFormControl
      id={`editor_${props?.name}`}
      required={required}
      sx={sx ? sx : { width: '100%' }}
    >
      {label && (
        <MUIFormLabel
          sx={{
            lineHeight: '1rem',
            fontWeight: 400,
            fontSize: '0.7rem',
            left: '12px'
          }}
        >
          {label}
        </MUIFormLabel>
      )}

      <Editor
        onLoadContent={() => {
          if (obfuscable) disableEditor();
        }}
        value={val}
        ref={ref}
        tinymceScriptSrc="/assets/libs/tinymce/tinymce.min.js"
        disabled={props.disabled}
        init={{
          ...SETTINGS[obfuscable ? 'OBFUSCALBE' : 'DEFAULT'],
          branding: false,
          paste_merge_formats: true,
          language: 'it',
          language_url: '/assets/libs/tinymce/langs/it.js',
          iframe_attrs: { id: `editor_${props?.name}` },
          height: 300,
          formats: {
            tindent_format: { selector: 'p', styles: { 'text-indent': '40mm' } }
          },
          font_size_formats:
            '4pt 5pt 6pt 8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
          paste_preprocess: (_editor, args) => {
            const divElement = document.createElement('div');

            //            args.content = args.content.replace(/<\/?span[^>]*>/g, '');

            divElement.innerHTML = args.content;

            const items = divElement.querySelectorAll('*');

            items.forEach((item: any) => {
              item.removeAttribute('class');
              item.removeAttribute('width');
              item.removeAttribute('height');

              // item.style.null;
              item.style.fontFamily = null;
              item.style.width = null;
              item.style.height = null;
              item.style.margin = null;
              item.style.padding = null;
              item.style['margin-top'] = null;
              item.style['margin-bottom'] = null;
              item.style['margin-left'] = null;
              item.style['margin-right'] = null;
              item.style['padding-top'] = null;
              item.style['padding-bottom'] = null;
              item.style['padding-left'] = null;
              item.style['padding-right'] = null;
              item.style['line-height'] = null;
              item.style['letter-spacing'] = null;
              item.style['mso-font-width'] = null;
              item.style['font-size'] = null;
              item.style['valign'] = null;
              item.style['mso-bidi-font-weight'] = null;
            });

            const tableSpanItems = divElement.querySelectorAll('table span');
            tableSpanItems.forEach((item: HTMLTableCellElement) => {
              item.style.fontSize = '8pt';
            });

            const tableItems = divElement.querySelectorAll('table');
            tableItems.forEach((item: any) => {
              item.border = 1;
              item.style.fontSize = '8pt';
            });

            args.content = divElement.innerHTML;
          },
          table_default_attributes: {
            fontSize: '8',
            border: '1'
          },
          table_default_styles: {
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: '8pt'
          },
          skin: 'oxide',
          skin_url: '/assets/libs/tinymce/skins/ui/oxide',
          content_css: '/assets/libs/tinymce/skins/content/default/content.min.css'
        }}
        onEditorChange={(a) => setValue(a)}
      />
    </MUIFormControl>
  );
};

export default MyEditor;
