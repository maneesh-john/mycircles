import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import SearchFilters from "./searchFilters";
import AskAQuestion from "./askAQuestion";

const HeaderComponent = (props: any) => {
  const {
    color,
    questionCategories,
    selectedCircle,
    userData,
    selectedTab,
    setselectedTab,
    search,
    prefillData,
  }: any = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`QUESTIONS & ANSWERS`}</Text>
      <Text style={styles.description}>
        You can ask questions and seek answers from members on your circles or
        from healthcare providers. Alternatively, you could also search for
        questions and answers added by others, based on certain categories
        below. You can even provide your comments on the answers.
      </Text>
      <View style={{ ...styles.tabs, borderColor: color }}>
        <Text
          onPress={() => setselectedTab(0)}
          style={{
            ...styles.tab,
            backgroundColor: selectedTab === 0 ? color : colors.secondary,
            color: selectedTab === 0 ? colors.secondary : "#333",
          }}
        >
          Search
        </Text>
        <Text
          onPress={() => setselectedTab(1)}
          style={{
            ...styles.tab,
            backgroundColor: selectedTab === 1 ? color : colors.secondary,
            color: selectedTab === 1 ? colors.secondary : "#333",
          }}
        >
          Ask a question
        </Text>
      </View>
      <View>
        {selectedTab === 0 ? (
          <SearchFilters
            search={search}
            questionCategories={questionCategories}
            color={color}
          />
        ) : (
          <AskAQuestion
            setselectedTab={setselectedTab}
            userData={userData}
            selectedCircle={selectedCircle}
            questionCategories={questionCategories}
            color={color}
            prefillData={prefillData}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: "#ccc",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  title: {
    fontSize: 18,
    paddingBottom: 8,
    fontFamily: fonts.LATO_BOLD,
  },
  description: {
    paddingBottom: 15,
    fontFamily: fonts.LATO_REGULAR,
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.LATO_BOLD,
    textTransform: "uppercase",
  },
});

export default HeaderComponent;
