import * as React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { init } from "../redux/actions/homeScreenActions";
import AuthNavigation from "./authNavigation";
import CirclesNavigation from "./circlesNavigations";

const AppNavigations = (props: any) => {
  const dispatch = useDispatch();
  const [isAppInitialized, setInitializeFlag] = React.useState(false);
  const { isCircleView } = useSelector((state: any) => state.app);
  React.useEffect(() => {
    props.init().then(() => {
      setInitializeFlag(true);
    });
  }, []);

  if (isAppInitialized) {
    return (
      <NavigationContainer>
        {isCircleView ? <CirclesNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    );
  } else {
    return null;
  }
};

export default connect(null, { init })(AppNavigations);
