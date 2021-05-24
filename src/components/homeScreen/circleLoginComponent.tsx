import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import colors from "../../constants/colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import { validate } from "../../utils/validations";
import { useDispatch } from "react-redux";
import { loginAction } from "../../redux/actions/homeScreenActions";

/*

patient - sahana.newpatient@yopmail.com / password. 
Caregiver - sahana.caregiver@yopmail.com/password
Advocate - sahana.advocate@yopmail.com/password
physician/hospital/clinic - udayan.m@deductiveclouds.com/dovemed 

*/

const CircleLoginComponent = (props: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>(""); //"newuser@yopmail.com");//"sahana.caregiver@yopmail.com");//"newuser@yopmail.com");//"d_tilica@yahoo.com");//"sahana.newpatient@yopmail.com"); //"udayan.m@deductiveclouds.com");
  const [password, setPassword] = useState<string>(""); //"Password123$");//"password");//"Password1!");//"password"); //"dovemed");
  const [pwdVisible, setpwdVisible] = useState(false);
  const [error, setError] = useState<any>({
    email: "",
    password: "",
  });
  const firstTextInputRef = useRef<any>(null);
  const refCallback = (textInputRef: any) => (node: any) => {
    textInputRef.current = node;
  };

  useEffect(() => {
    if (error.email || error.password) {
      if (email && email.length) {
        setError((prevState: any) => {
          const state = { ...prevState };
          state.email = "";
          return state;
        });
      }
      if (password && password.length) {
        setError((prevState: any) => {
          const state = { ...prevState };
          state.password = "";
          return state;
        });
      }
    }
  }, [email, password]);

  const validateRequest = (): boolean => {
    let valid: boolean = true;
    if (!(email && email.length)) {
      setError((prevState: any) => {
        const state = { ...prevState };
        state.email = "Email is required";
        return state;
      });
      valid = false;
    } else if (!validate(email, "email")) {
      setError((prevState: any) => {
        const state = { ...prevState };
        state.email = "Invalid email";
        return state;
      });
      valid = false;
    }

    if (!(password && password.length)) {
      setError((prevState: any) => {
        const state = { ...prevState };
        state.password = "Password is required";
        return state;
      });
      valid = false;
    } else if (!validate(password, "password")) {
      setError((prevState: any) => {
        const state = { ...prevState };
        state.password = "Password must be minimum of 8 character";
        return state;
      });
      valid = false;
    }
    return valid;
  };

  const login = async () => {
    const isValid: boolean = validateRequest();
    if (isValid) {
      try {
        await dispatch(loginAction({ email, password }));
        props.navigation.replace("LandingScreen");
        //props.navigation.goBack()
      } catch (error) {}
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.loginText}>Log In</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          keyboardType="email-address"
          maxLength={50}
          autoCapitalize="none"
          value={email}
          returnKeyType={"next"}
          onSubmitEditing={() => {
            email && email.length ? firstTextInputRef.current.focus() : null;
          }}
          onChangeText={(value) => setEmail(value)}
        />
        <Text style={styles.error}>{error.email}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            secureTextEntry={!pwdVisible}
            keyboardType="default"
            value={password}
            returnKeyType="done"
            autoCapitalize="none"
            ref={refCallback(firstTextInputRef)}
            onChangeText={(value) => setPassword(value)}
          />
          <Icon
            onPress={() => setpwdVisible(!pwdVisible)}
            style={{ marginLeft: "-10%", marginTop: 5 }}
            name={pwdVisible ? "eye" : "eye-slash"}
            size={16}
          />
        </View>
        <Text style={styles.error}>{error.password}</Text>
      </View>
      <Text style={styles.tAndC}>
        By logging into DoveMed you agree to your{" "}
        <Text style={styles.tAndCSpcl}>Terms of Use</Text> and{" "}
        <Text style={styles.tAndCSpcl}>Privacy Policy</Text>. We have changed
        the login system from username/password. If you do not remember your
        email, please send a mail to{" "}
        <Text
          style={styles.tAndCSpcl}
          onPress={() => Linking.openURL("mailto:contact@dovemed.com")}
        >
          contact@dovemed.com
        </Text>
        .
      </Text>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.loginBtn}
        onPress={login}
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.mainColor,
    paddingHorizontal: 40,
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    paddingVertical: 40,
    color: colors.secondary,
  },
  formContainer: {
    marginVertical: 5,
  },
  inputField: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    width: "100%",
    fontSize: 16,
  },
  tAndC: {
    marginTop: 5,
    fontSize: 13,
    color: colors.secondary,
    letterSpacing: 0.5,
    textAlign: "justify",
    lineHeight: 16,
  },
  loginBtn: {
    marginHorizontal: "15%",
    backgroundColor: colors.secondary,
    marginVertical: 30,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  btnText: {
    color: colors.mainColor,
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
  },
  tAndCSpcl: {
    color: "pink",
  },
  error: {
    marginBottom: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "red",
  },
});
export default CircleLoginComponent;
