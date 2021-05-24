export const getAlphaColor = (curr_color: string) => {
    let color: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(curr_color)) {
        color = curr_color.substring(1).split('');
        if (color.length == 3) {
            color = [color[0], color[0], color[1], color[1], color[2], color[2]];
        }
        color = '0x' + color.join('');
        return 'rgba(' + [(color >> 16) & 255, (color >> 8) & 255, color & 255].join(',') + ',.25)';
    }
}