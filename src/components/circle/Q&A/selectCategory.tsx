import React from "react";
import { Portal, Dialog } from "react-native-paper";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";

const SelectCategory = ({
  modalKey,
  openCategoryModal,
  setopenCategoryModal,
  questionCategories,
  onSelect,
  color,
  selectedCategory,
}: any) => {
  return (
    <Portal>
      <Dialog
        key={modalKey}
        visible={openCategoryModal}
        onDismiss={() => setopenCategoryModal(false)}
      >
        <View style={styles.body}>
          <ScrollView contentContainerStyle={styles.options}>
            <Text
              style={[styles.option, styles.none]}
              onPress={() => onSelect()}
            >
              None
            </Text>
            {questionCategories.map((rs: any) => (
              <Text
                onPress={() => {
                  onSelect(rs);
                }}
                style={{
                  ...styles.option,
                  color: selectedCategory?.id == rs.id ? color : "#333",
                }}
                key={rs.id}
              >
                {rs.display_name}{" "}
              </Text>
            ))}
          </ScrollView>
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    paddingVertical: 10,
  },
  options: {
    paddingHorizontal: 20,
  },
  option: {
    fontFamily: fonts.LATO_REGULAR,
    paddingVertical: 5,
    marginVertical: 2,
    fontSize: 15,
    width: "100%",
    textTransform: "capitalize",
  },
  none: {
    color: "#888",
  },
});

export default SelectCategory;
