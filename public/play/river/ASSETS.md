# River 素材与来源

## 独立生成的地形素材

- `land-alpine-v2.png`：本项目生成的山间湖泊地形，重新细化树木与岩石岸坡，天空和水面为透明区域；`land-alpine.png` 保留为旧版。
- `land-forest.png`：本项目生成的林间河流地形，天空和水面为透明区域。
- `land-estuary.png`：本项目生成的开阔河口地形，天空和水面为透明区域。
- `alpine-lake.png`、`forest-river.png`、`river-mouth.png`：生成的原始图片，保留作后续编辑来源；当前运行不使用其中的水面。
- `riverbed.png`：旧概念素材，当前版本未使用。

## 河床石子材质

来源：[River Small Rocks — Poly Haven](https://polyhaven.com/a/river_small_rocks)
作者：Rob Tuytel（摄影、处理）；Rico Cilliers（调整）。
许可：[CC0](https://polyhaven.com/license)，2026-10-11 核实来源页。

本地文件：
- `pebbles-color.jpg`：2K Diffuse
- `pebbles-normal.jpg`：2K OpenGL Normal
- `pebbles-height.jpg`：2K Displacement

## 渲染依赖

Three.js，MIT license。Water addon 用于平面反射相机与裁剪；水面、水底和天空使用本项目的着色器。发布包保留 `vendor/THREE-LICENSE.txt`。

## 参考研究

Oscar Dumlao 的网站用于交互和技术结构研究。其脚本仅保存在工作研究目录中，没有复制进 River 运行代码或发布包；没有使用其地形图片、音轨、身份内容。

## Nature audio — added 2026-10-12

All files are locally hosted stereo MP3, 44.1 kHz / 128 kbps; fetched from the source page's public high-quality preview. No audio from the reference website is used.

- Archived, no longer shipped: `ambience-stream.mp3`: [Gentle Relaxing Stream 2](https://freesound.org/people/Geoff-Bremner-Audio/sounds/697496/) by Geoff-Bremner-Audio, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Excerpt 8–70 s, high-pass 100 Hz, loudness normalization followed by a broad −2 dB cut at 2.8 kHz, −4 dB high shelf at 3.8 kHz and low-pass 7.2 kHz. Stream mixing level reduced about 15% to soften the water texture. License verified on the source page (the current source is BY 4.0, despite some third-party listings saying CC0).
- `ambience-birds.mp3`: [Forest_Birds (loop) 02.wav](https://freesound.org/people/VKProduktion/sounds/231537/) by VKProduktion, [CC0](https://creativecommons.org/publicdomain/zero/1.0/). 30 s, high-pass 180 Hz, low-pass 11 kHz, loudness normalization.
- `ambience-night.mp3`: [Flowing water in canal after a storm and insect chirping at mignight](https://freesound.org/people/lastraindrop/sounds/744133/) by lastraindrop, CC0. Excerpt 12–80 s of the successfully downloaded beginning of the recording; high-pass 160 Hz, low-pass 9.5 kHz, loudness normalization. Contains flowing water and night wildlife.

All three are crossfaded over two seconds at runtime to form continuous loops. Attribution and modification details are visible in `audio-credits.html`, linked from About. Files are fetched and decoded when playback starts: automatically where allowed, otherwise after the first user interaction.

## Occasional woodland calls — 2026-10-12

`ambience-gibbons.mp3`: [Hoolock gibbon Mizoram](https://commons.wikimedia.org/wiki/File:Hoolock_gibbon_Mizoram.ogg), recorded by T. R. Shankar Raman. Wild western hoolock gibbon calls in Dampa Tiger Reserve, Mizoram, India. Source and adapted recording licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Attribution and downloadable adaptation linked from the in-site sound credits.

Adaptations: first 60 seconds; 230 Hz high-pass and 4.2 kHz low-pass; loudness normalized to −24 LUFS / −6 dBTP; mono 44.1 kHz / 96 kbps MP3. Runtime excerpts of 10–14 seconds at offsets 3, 22 or 41 seconds; soft envelopes, subdued gain and slight stereo placement. First call 6–10 seconds after eligible woodland playback, then 35–65 seconds of silence between calls. Used only in Flow during daylight; fades out on pause, hidden page, scene exit or nightfall. Licensed file is independently available; no reference-site audio copied.

## Clearer brook replacement — 2026-10-12

Current water bed: `ambience-stream-clear.mp3`, [Small brook, stream, water sound](https://freesound.org/people/SamsterBirdies/sounds/584269/) by SamsterBirdies, CC0. Recorded with Primo EM272 microphones into a Tascam DR-100mkIII. Excerpt 6–66 seconds. 110 Hz high-pass, broad −2.5 dB cut at 420 Hz, 12.5 kHz low-pass, +5 dB gain with a −5 dBFS peak limiter to contain isolated splash transients; no high-frequency shelf attenuation. Stereo 44.1 kHz / 160 kbps MP3, two-second runtime seam blend. Replaces the previous stream asset in both source and release builds. Old water files remain only as local archives.

## Sparse wildlife revision — 2026-10-12

Birds are no longer looped: 2–3 second phrases with 70–130 seconds between phrases, lower gain. Gibbons now use `ambience-gibbon-distant.mp3` instead of the full recording: 3.4–8.6 second sustained phrase from the same CC BY-SA 4.0 source; 380 Hz high-pass, two 1.9 kHz low-pass filters, light FFT denoising (6 dB), normalized then faded. The high-frequency background calls are attenuated; no claim of perfect source separation. Gibbon phrases are 100–180 seconds apart and slightly quieter. Birds and gibbons cannot overlap, with 20–25 seconds of quiet between types. Initial waits: birds 20–40 seconds, gibbons 45–80 seconds. Previous gibbon file is archived locally and no longer shipped.
