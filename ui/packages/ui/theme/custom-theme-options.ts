export const customThemeOptions = {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'dark' },
          style: {
            background: '#77001D',
            color: 'white',
            '&:hover': {
              backgroundColor: '#36000D'
            },
            '&.Mui-disabled': {
              color: '#AE314F'
            },
            '& .MuiLoadingButton-loadingIndicator': {
              color: 'white'
            }
          }
        }
      ]
    }
  }
};
