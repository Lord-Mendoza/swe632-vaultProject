// starter code: https://ant.design/components/auto-complete
import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';

const searchResult = (query, data) =>
    Object.values(data)
        .map((entry, idx) => {
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
                                    Found {`${field.match(new RegExp(`\\b\\w*${query}\\w*\\b`, 'i'))}`} in {`${entry.title}`}
                                </span>
                            </div>
                        ),
                    };
                }
            }

            return undefined;
        })
        .filter((result) => result !== undefined);

const SearchBox = ({entries}) => {
    const [options, setOptions] = useState([]);
    const handleSearch = (value) => {
        setOptions(value ? searchResult(value, entries) : []);
    };
    const onSelect = (value) => {
        console.log('onSelect', value);
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