import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import CircleCard from "../../components/homeScreen/circleCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllCircles } from "../../redux/actions/homeScreenActions";

const AllCirclesComponent = (props: any) => {
  const dispatch = useDispatch();
  const circles: Array<any> = useSelector((state: any) => state.app.allCircles);
  const userData: any = useSelector((state: any) => state.app.userData);
  const isLoggedIn: any = useSelector((state: any) => state.app.isLoggedIn);

  useEffect(() => {
    (async () => {
      await dispatch(getAllCircles());
    })();
  }, []);

  return (
    <View style={styles.cardContainer}>
      {circles.map((circle: any) => (
        <CircleCard
          key={circle.id}
          circle={circle}
          navigation={props.navigation}
          userData={userData}
          isLogin={isLoggedIn}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 15,
    marginTop: 15,
  },
});

export default AllCirclesComponent;
