// starter code: https://ant.design/components/auto-complete
import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';

const searchResult = (query, data) => {
    const arr = Object.values(data)
        .map((entry) => {
            const fields = [entry.title, ...(entry.sections?.map((s) => s.content) ?? [])];

            for (const field of fields) {
                if (field?.toLowerCase().includes(query)) {
                    return {
                        value: `${entry.title}`,
                        label: (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>
                                    Found {`${field.match(new RegExp(`\\b\\w*${query}\\w*\\b`, 'i'))}`} in <strong>{`${entry.title}`}</strong>
                                </span>
                            </div>
                        ),
                    };
                }
            }

            return undefined;
        })
        .filter((result) => result !== undefined);

    // if empty, say no results found
    if (arr.length === 0) {
        arr.push({
            value: '',
            label: (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                                <span>
                                    No results found
                                </span>
                </div>
            ),
        });
    }

    return arr;
}

const SearchBox = ({entries, onClickResult}) => {
    const [options, setOptions] = useState([]);
    const handleSearch = (value) => {
        setOptions(value ? searchResult(value, entries) : []);
    };
    const onSelect = (value) => {
        if (value !== '') {
            // find key whose object matches the title
            // inefficient, but it'll work :)
            for (let key in entries) {
                if (entries[key].title === value) {
                    onClickResult(new MouseEvent(''), { name: key });
                }
            }
        }
    };
    return (
        <AutoComplete
            popupMatchSelectWidth={252}
            style={{
                width: 300,
            }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            size="large"
        >
            <Input.Search size="large" placeholder="Search" enterButton/>
        </AutoComplete>
    );
};
export default SearchBox;