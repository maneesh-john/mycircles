import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import HeaderComponent from "../../components/circle/Q&A/headerComponent";
import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import { getQuestionCategories } from "../../redux/actions/homeScreenActions";
import { getQuestionsWithSearch } from "../../redux/actions/profileActions";
import QuestionCard from "../../components/circle/common/questionCard";
import fonts from "../../constants/fonts";
import Links from "../../components/homeScreen/links";

const QandAScreen = (props: any) => {
  const dispatch = useDispatch();

  const {
    selectedCircle,
    userData,
    questionCategories,
    myProfileInfo,
  } = useSelector((state: any) => state.app);
  const { questionsList } = useSelector((state: any) => state.profile);

  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const askQuestion = props.route.params?.askQuestion;
  const prefillData = props.route.params?.prefillData;

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTab, setselectedTab] = useState<number>();
  const [display, setDisplay] = useState<number>(1);
  const [input, setinput] = useState<string>("");
  const [selectedCategory, setselectedCategory] = useState<any>();

  useEffect(() => {
    setselectedTab(askQuestion ? 1 : 0);
  }, [askQuestion]);

  useEffect(() => {
    dispatch(getQuestionCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTab === 0) {
      dispatch(
        getQuestionsWithSearch(
          1,
          display,
          selectedCircle.id,
          input,
          selectedCategory?.display_name
        )
      );
    }
  }, [selectedTab, display]);

  const ViewMore = () => {
    setDisplay(display + 5);
  };

  const onRefresh = () => {
    if (selectedTab === 0) {
      if (display === 1) {
        dispatch(getQuestionsWithSearch(1, 1, selectedCircle.id));
      } else {
        setDisplay(1);
      }
    }
  };
  const search = (inp: string, category: any) => {
    dispatch(
      getQuestionsWithSearch(
        1,
        1,
        selectedCircle.id,
        inp,
        category?.display_name
      )
    );
    setDisplay(1);
    setselectedCategory(category);
    setinput(inp);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <HeaderComponent
          prefillData={prefillData}
          search={search}
          selectedTab={selectedTab}
          setselectedTab={setselectedTab}
          selectedCircle={selectedCircle}
          userData={userData}
          color={color}
          questionCategories={questionCategories}
        />
        {selectedTab === 0 ? (
          <View>
            <Text style={styles.count}>
              {questionsList?.paginator?.total_count
                ? questionsList?.paginator?.total_count
                : 0}{" "}
              Results
            </Text>
            {questionsList && questionsList?.data?.length ? (
              questionsList.data.map((item: any) => (
                <QuestionCard
                  type="otheruser"
                  key={item.id}
                  navigator={props.navigation}
                  otherScreen={true}
                  item={item}
                  selectedCircle={selectedCircle}
                  userProfileInfo={myProfileInfo}
                  userData={userData}
                />
              ))
            ) : (
              <View style={{ marginTop: 40 }}>
                <Text
                  style={{ color: "#888", width: "100%", textAlign: "center" }}
                >
                  No questions found
                </Text>
              </View>
            )}
            {questionsList?.paginator?.total_count > display ? (
              <Text
                onPress={ViewMore}
                style={{ ...styles.viewMore, backgroundColor: color }}
              >
                View More
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
      <Links color={color} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    // padding: 15,
  },
  container: {
    padding: 15,
    backgroundColor: "#f6f6f6",
  },
  count: {
    width: "100%",
    paddingVertical: 10,
    textAlign: "center",
    fontFamily: fonts.LATO_REGULAR,
  },
  viewMore: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: 120,
    alignSelf: "center",
    borderRadius: 15,
    color: colors.secondary,
    overflow: "hidden",
  },
});

export default QandAScreen;
