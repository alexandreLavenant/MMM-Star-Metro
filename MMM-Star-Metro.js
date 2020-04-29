Module.register("MMM-Star-Metro", {
	// Default module config.   
	defaults: {
        updateInterval  : 60, // 60 secondes
        stationName     : 'République',
        direction       : 1,
        displayedRecords: 2
    },
    
    metroRecords: [],
    numberRows  : 10,

    getTranslations: function() {
        return {
            en: 'translations/en.json',
            fr: 'translations/fr.json'
        };
    },
    getStyles: function() {
        return [ 'metro.css' ];
    },

    generateUrl: function(rows = 10) {
        const baseUrl   = 'https://data.explore.star.fr/api/records/1.0/search/',
            dataset     = 'tco-metro-circulation-passages-tr',
            sort        = '-arrivee',
            facets      = {
                'nomcourtligne' : null,
                'sens'          : this.config.direction,
                'destination'   : null,
                'nomarret'      : this.config.stationName,
                'precision'     : 'Applicable'
            };

        var facetParameters     = '',
            refineParameters    = ''
            ;

        for (const facetName in facets) {
            facetParameters += '&facet=' + facetName;
            if (facets[facetName] === null) {
                continue;
            }

            refineParameters += '&refine.' + facetName + '=' + facets[facetName];
        }

        return baseUrl + '?dataset=' + dataset + '&rows=' + rows + '&sort=' + sort + facetParameters + refineParameters;
    },
    fillMetroRecords: async function() {
        console.log('[' + this.name + '] Updating metro records');

        return fetch(this.generateUrl(this.numberRows))
            .then(response => response.json())
            .then((data) => {
                if (data.records) {
                    this.metroRecords = data.records;
                }
            })
            .catch((e) => {
                console.error(e);
            });
    },
    cleanMetroRecords: function() {
        console.log('[' + this.name + '] Cleaning metro records');

        this.metroRecords.forEach((record, index, records) => {
            let nowDate         = new Date(),
                departureDate   = new Date(record.fields.depart)
                ;

            // Record too old, remove it
            if (nowDate > departureDate) {
                records.splice(index, 1);
            }
        });
    },
    displayMetroRecords: function() {
        console.log('[' + this.name + '] Displaying metro records');

        if (this.metroRecords.length === 0) {
            return `<p>${this.translate('noRecord')}</p>`;
        }

        var i       = 0,
            l       = this.config.displayedRecords,
            html    = '<table>'
            ;
    
        for (i; i < l; i++) {
            let record      = this.metroRecords[i],
                nowDate     = new Date(),
                arrivalDate = new Date(record.fields.arrivee)
                diffMinutes = Math.floor(((arrivalDate - nowDate)/1000) / 60),
                details     = `${record.fields.nomarret} ${this.translate('in')} ${diffMinutes} minutes`
                ;

            if (diffMinutes <= 1) {
                details = `${record.fields.nomarret} ${this.translate('approaching')}`;
            }

            html +=
                `<tr>
                    <td class="metro-star-icon">
                        <svg x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                            <g>
                                <path style="fill:#FFFFFF;" d="M936.9,769.5V197.8c0-32.7-16.3-65.3-40.8-81.7C822.6,50.8,683.8,10,528.6,10h-49C259.1,10,71.3,91.7,71.3,189.7l0,0v8.2v571.7c0,49,40.8,89.8,89.8,106.2L30.4,990h138.8l122.5-114.3h416.5L830.8,990h138.8L838.9,875.7C896.1,859.3,936.9,818.5,936.9,769.5 M332.6,99.8h343c24.5,0,40.8,16.3,40.8,40.8s-16.3,40.8-40.8,40.8h-343c-24.5,0-40.8-16.3-40.8-40.8S308.1,99.8,332.6,99.8z M324.4,777.7c-49,0-89.8-40.8-89.8-89.8c0-49,40.8-89.8,89.8-89.8c49,0,89.8,40.8,89.8,89.8C414.3,745,373.4,777.7,324.4,777.7z M683.8,777.7c-49,0-89.8-40.8-89.8-89.8c0-49,40.8-89.8,89.8-89.8c49,0,89.8,40.8,89.8,89.8C773.6,745,732.8,777.7,683.8,777.7z M830.8,418.3c0,40.8-32.7,73.5-73.5,73.5H250.9c-40.8,0-73.5-32.7-73.5-73.5v-73.5c0-40.8,32.7-73.5,73.5-73.5h506.3c40.8,0,73.5,32.7,73.5,73.5V418.3z"/>
                            </g>
                        </svg>
                    </td>
                    <td class="metro-star-details">${details}</td>
                </tr>
                `
                ;
        };

        html += '</table>';

        return html;
    },
	getDom: async function() {
        var wrapper = document.createElement('div');
        wrapper.className = 'mmm-star-metro';

        this.cleanMetroRecords();

        if (this.metroRecords.length < this.config.displayedRecords) {
            await this.fillMetroRecords();
        }

        wrapper.innerHTML = this.displayMetroRecords();
        
		return wrapper;
    },
    start: function() {
        console.log('Starting module: ' + this.name);

        this.numberRows = Math.max(this.config.displayedRecords * 2, this.numberRows);
        
        var self = this;
        setInterval(function() {
            self.updateDom(5e2); // 500 ms
        }, this.config.updateInterval * 1e3);
    }
});