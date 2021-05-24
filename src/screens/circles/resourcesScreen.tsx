import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import colors from '../../constants/colors'
import { useSelector, useDispatch } from 'react-redux';
import fonts from '../../constants/fonts';
import { getResourcesList } from '../../redux/actions/resourcesAction';
import ResourceItem from '../../components/circle/resources/resourceItem';
import Links from '../../components/homeScreen/links';

const ResourcesScreen = (props: any) => {

    const dispatch = useDispatch()

    const { resourcesData } = useSelector((state: any) => state.profile);
    const { selectedCircle, userData, myProfileInfo } = useSelector((state: any) => state.app);

    const color = selectedCircle.color_code ? selectedCircle.color_code : colors.mainColor;
    const role = myProfileInfo?.user_info?.role;

    const [showFilters, setshowFilters] = useState<boolean>(false)
    const [selectedFilter, setselectedFilter] = useState<string>('')
    const filtersList: Array<string> = ['Articles', 'Polls', 'Videos', 'Trivia', 'Slideshows']
    const [page, setPage] = useState<number>(1);
    const [dataList, setDataList] = useState<any>({});
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const toggleFiltersVisibility = () => setshowFilters(!showFilters)


    const getData = (page: number, size: number, type?: string) => {
        dispatch(getResourcesList(page, size, type, selectedCircle.id))
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            if (selectedCircle && selectedCircle.id) {
                getData(1, 2, undefined)
                setPage(1)
                setselectedFilter('')
            }
        });
        return unsubscribe;
    }, [props.navigation, selectedCircle])

    const displayItem = (type: string): boolean => {
        if (dataList && dataList[type]?.length && (selectedFilter === type || selectedFilter === '')) {
            return true;
        } else {
            return false
        }
    }

    useEffect(() => {
        if (page === 1) {
            setDataList(resourcesData)
        } else {
            if (selectedFilter) {
                const _data = { ...dataList };
                _data[selectedFilter] = [...dataList[selectedFilter], ...resourcesData[selectedFilter]]
                setDataList(_data)
            } else {
                setDataList(resourcesData)
            }
        }
    }, [resourcesData])

    const viewMore = (type: string) => {
        if (type === selectedFilter) {
            getData(page + 1, 10, type)
            setPage(page + 1)
        } else {
            setshowFilters(true)
            setselectedFilter(type)
            setPage(1)
            getData(1, 10, type)
        }
    }

    const selectAFilter = (type: any) => {
        if (type !== selectedFilter) {
            setselectedFilter(type)
            setPage(1)
            getData(1, 10, type)
        }
    }

    const clearAll = () => {
        setselectedFilter('')
        getData(1, 2, undefined)
    }

    const onRefresh = () => {
        if (selectedFilter) {
            getData(1, 10, selectedFilter)
            if (page !== 1) {
                setPage(1)
            }
        } else {
            getData(1, 2, undefined)
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.screen}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.container}>
                <View style={[styles.card, styles.header]}>
                    <Text style={styles.headerTitle}>USEFUL RESOURCES</Text>
                    <Text style={styles.headerDescription}>You can search from a wealth of DoveMed articles, procedures, quizzes, slideshows, videos, and physician blogs, all related to Multiple Sclerosis. You can also take quizzes, attend to polls, answer trivia questions, and read current medical news articles.</Text>
                    <View style={styles.row}>
                        <Text style={styles.filterToggle} onPress={toggleFiltersVisibility}>{showFilters ? 'Hide' : 'Show'} Filters</Text>
                        {selectedFilter ? <Text style={styles.clearFilter} onPress={clearAll}>Clear Filters</Text> : null}
                    </View>
                    {showFilters ? <View style={[styles.row, styles.filters]}>
                        {filtersList.map(rs => (
                            <TouchableOpacity onPress={() => selectAFilter(rs)} key={rs} style={{ ...styles.filter, borderColor: color, backgroundColor: selectedFilter === rs ? color : colors.secondary }}>
                                <Text style={{ ...styles.filterText, color: selectedFilter === rs ? colors.secondary : color }}>{rs}</Text>
                            </TouchableOpacity>
                        ))}
                    </View> : null}
                </View>
                {displayItem('Articles') ? <ResourceItem viewMore={viewMore} selectedCircle={selectedCircle} userData={userData} color={color} type='articles' showMore={dataList?.articles_pagination?.total_count > dataList?.Articles?.length} title='Articles' data={dataList?.Articles} /> : null}
                {displayItem('Polls') ? <ResourceItem viewMore={viewMore} selectedCircle={selectedCircle} userData={userData} color={color} type='poll' showMore={dataList?.polls_pagination?.total_count > dataList?.Polls?.length} title='Polls' data={dataList?.Polls} /> : null}
                {displayItem('Videos') ? <ResourceItem viewMore={viewMore} selectedCircle={selectedCircle} userData={userData} color={color} type='videos' showMore={dataList?.videos_pagination?.total_count > dataList?.Videos?.length} title='Videos' data={dataList?.Videos} /> : null}
                {displayItem('Slideshows') ? <ResourceItem viewMore={viewMore} selectedCircle={selectedCircle} userData={userData} color={color} type='slideshows' showMore={dataList?.slideshows_pagination?.total_count > dataList?.Slideshows?.length} title='Slideshows' data={dataList?.Slideshows} /> : null}
                {displayItem('Trivia') ? <ResourceItem viewMore={viewMore} selectedCircle={selectedCircle} userData={userData} color={color} type='trivia' showMore={dataList?.trivia_pagination?.total_count > dataList?.Trivia?.length} title='Trivia' data={dataList?.Trivia} /> : null}
            </View>
            <Links color={color} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
    },
    container: {
        padding: 20,
        backgroundColor: '#f6f6f6'
    },
    card: {
        backgroundColor: colors.secondary,
        borderRadius: 15,
        shadowColor: '#ccc',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        padding: 15,
        marginBottom: 15
    },
    headerTitle: {
        fontSize: 18,
        paddingBottom: 8,
        fontFamily: fonts.LATO_BOLD
    },
    headerDescription: {
        paddingBottom: 15,
        fontFamily: fonts.LATO_REGULAR
    },
    filterToggle: {
        textDecorationLine: 'underline',
        fontFamily: fonts.LATO_BOLD,
        fontSize: 16
    },
    clearFilter: {
        fontFamily: fonts.LATO_REGULAR,
        marginLeft: 15,
        fontSize: 15,
        color: '#444'
    },
    filters: {
        marginVertical: 10,
        flexWrap: "wrap",
        marginHorizontal: -5,
        justifyContent: 'center'
    },
    filter: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        borderWidth: 1,
        margin: 5
    },
    filterText: {
        width: '100%'
    },
})

export default ResourcesScreen

