import * as React from 'react';

// : Components
import C from './../../../Components';

export interface iProps {
  type: 'Card' | 'Text';
  errorCode: string;
  errorMessage: string;
}

export const Error: React.FC<iProps> = (props) => {
  const [errorComponent, setErrorComponent] = React.useState<JSX.Element>(<></>);

  const create_CardError = () => (
    <C.Card style={{ backgroundColor: 'FireBrick' }}>
      <C.CardItem>
        <C.Text>Oops, Something Went Wrong!</C.Text>
      </C.CardItem>
      <C.CardItem>
        <C.Text>Error Code: {props.errorCode}</C.Text>
        <C.Text>{props.errorMessage}</C.Text>
      </C.CardItem>
    </C.Card>
  );

  React.useEffect(() => {
    switch (props.type) {
      case 'Card':
        setErrorComponent(create_CardError());
        break;
    }
  }, []);

  return errorComponent;
};
