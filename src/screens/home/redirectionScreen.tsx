import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import colors from "../../constants/colors";
import Links from "../../components/homeScreen/links";
import LandingComponent from "../../components/homeScreen/landingComponent";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useSelector } from "react-redux";
import MyCirclesComponent from "../../components/homeScreen/myCirclesComponent";
import fonts from "../../constants/fonts";
import AllCirclesComponent from "../../components/homeScreen/allCirclesComponent";

const RedirectionScreen = (props: any) => {
  const width = Dimensions.get("screen").width;
  const userData: any = useSelector((state: any) => state.app.userData);
  const carousel = useRef<any>(null);
  const [activeSlide, setactiveSlide] = useState(0);
  useEffect(() => {
    // if (!(userData && userData.token)) {
    //   props.navigation.replace("CircleLogin");
    // }
  }, [userData]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [props.navigation, userData]);

  const renderItem = ({ item, index }: any) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.text}</Text>
        <Text style={styles.name}>{item.user.name}</Text>
        <Text style={styles.role}>{item.user.role}</Text>
      </View>
    );
  };

  const data = [
    {
      text:
        "“Lorem ipsum dolor sit amet, eu constituto instructior consectetuer nec, sit eu simul dicunt epicuri, iusto sanctus apeirian at nam. Tollit delicata te nec. Aperiam nominavi salutandi est at. Vis eu sonet eirmod detraxit. No paulo inciderint has. Nullam intellegam comprehensam mei id, no vel possim luptatum adolescens, ex qui persecuti necessitatibus.”",
      user: {
        name: "Elisabeth Taylor",
        role: "MyIBSCircle",
      },
    },
    {
      text:
        "“Lorem ipsum dolor sit amet, eu constituto instructior consectetuer nec, sit eu simul dicunt epicuri, iusto sanctus apeirian at nam. Tollit delicata te nec. Aperiam nominavi salutandi est at. Vis eu sonet eirmod detraxit. No paulo inciderint has. Nullam intellegam comprehensam mei id, no vel possim luptatum adolescens, ex qui persecuti necessitatibus.”",
      user: {
        name: "Elisabeth Taylor",
        role: "MyIBSCircle",
      },
    },
    {
      text:
        "“Lorem ipsum dolor sit amet, eu constituto instructior consectetuer nec, sit eu simul dicunt epicuri, iusto sanctus apeirian at nam. Tollit delicata te nec. Aperiam nominavi salutandi est at. Vis eu sonet eirmod detraxit. No paulo inciderint has. Nullam intellegam comprehensam mei id, no vel possim luptatum adolescens, ex qui persecuti necessitatibus.”",
      user: {
        name: "Elisabeth Taylor",
        role: "MyIBSCircle",
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.mainText}>
          We create social networks for millions of people living with chronic
          conditions.
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.cantFind}>
          <Text style={styles.cantFindTitle}>Already have an account ?</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cantFindAcion}
            onPress={() => props.navigation.replace("CircleLogin")}
          >
            <Text style={styles.cantFindAcionText}>Login</Text>
          </TouchableOpacity>
        </View>
        {/* <AllCirclesComponent {...props} /> */}
        <View style={styles.cantFind}>
          <Text style={styles.cantFindTitle}>Create a new account</Text>
          <TouchableOpacity
              activeOpacity={0.5}
              style={styles.cantFindAcion}
              onPress={() => props.navigation.navigate("LandingScreen")}
            >
              <Text style={styles.cantFindAcionText}>Register</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.carouselHolder}>
          <Text style={styles.carouselheader}>What our members are saying</Text>
          <Carousel
            ref={(c: any) => {
              carousel.current = c;
            }}
            data={data}
            sliderWidth={width - 32}
            itemWidth={width - 32}
            renderItem={renderItem}
            onSnapToItem={(index) => setactiveSlide(index)}
          />
          <Pagination
            dotsLength={data.length}
            activeDotIndex={activeSlide}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: colors.mainColor,
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      </View>
      <Links />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
  },
  header: {
    backgroundColor: colors.mainColor,
    paddingHorizontal: 15,
    paddingVertical: 40,
  },
  mainText: {
    color: colors.secondary,
    fontSize: 28,
    fontFamily: fonts.LATO_BOLD,
    // fontWeight: 'bold',
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subText: {
    marginTop: 40,
    marginBottom: 20,
    color: colors.secondary,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 1,
  },
  body: {
    paddingVertical: 30,
    paddingHorizontal: 14,
  },
  subBody: {
    paddingBottom: 30,
    paddingTop: 0,
    paddingHorizontal: 14,
    backgroundColor: "green",
  },
  toggleWrapper: {
    flexDirection: "row",
    marginHorizontal: "1%",
    justifyContent: "center",
    borderRadius: 40,
    borderColor: colors.mainColor,
    borderWidth: 1,
    overflow: "hidden",
  },
  toggleContainer: {
    flex: 1,
    paddingVertical: 17,
    paddingHorizontal: 40,
    backgroundColor: colors.secondary,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: fonts.LATO_BOLD,
    textTransform: "uppercase",
    textAlign: "center",
  },
  moreConditions: {
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: "#A3A3A3",
    borderRadius: 30,
  },
  moreConditionsText: {
    fontSize: 16,
    fontFamily: fonts.LATO_BOLD,
    color: colors.secondary,
    textAlign: "center",
    textTransform: "uppercase",
  },
  cantFind: {
    paddingHorizontal: 18,
    paddingVertical: 28,
    marginBottom: 30,
    //marginVertical: 30,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cantFindTitle: {
    fontSize: 20,
    fontFamily: fonts.LATO_BOLD,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  cantFindDesc: {
    fontSize: 18,
    letterSpacing: 0.5,
    textAlign: "center",
    fontFamily: fonts.LATO_REGULAR,
    marginBottom: 30,
  },
  cantFindAcion: {
    backgroundColor: colors.mainColor,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 11,
    marginHorizontal: "20%",
  },
  cantFindAcionText: {
    textAlign: "center",
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.LATO_REGULAR,
    textTransform: "uppercase",
  },
  carouselHolder: {
    paddingHorizontal: 17,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: colors.secondary,
    marginHorizontal: -14,
  },
  carouselheader: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: fonts.LATO_BOLD,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  slide: {},
  title: {
    color: "#003333",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.3,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
  },
  name: {
    marginTop: 23,
    textAlign: "center",
    color: "#003333",
    fontSize: 16,
    fontFamily: fonts.LATO_BOLD,
  },
  role: {
    textAlign: "center",
    color: "#003333",
    fontSize: 14,
    fontFamily: fonts.LATO_REGULAR,
  },
});

export default RedirectionScreen;
