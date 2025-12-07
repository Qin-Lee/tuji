<?php
/**
 * 星火AI代理接口
 * 用于生成景点推荐和旅行计划
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 星火API配置
define('SPARK_API_URL', 'https://spark-api-open.xf-yun.com/v2/chat/completions');
define('SPARK_API_KEY', 'YJdoliFpEtTfCXtoLPve:SEjeKHxzaSZTTHlolcsG');

/**
 * 调用星火AI
 */
function callSparkAI($prompt, $maxTokens = 2000) {
    $data = [
        'model' => 'x1',
        'messages' => [
            ['role' => 'user', 'content' => $prompt]
        ],
        'max_tokens' => $maxTokens,
        'temperature' => 0.7
    ];

    $ch = curl_init(SPARK_API_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . SPARK_API_KEY
        ],
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        return ['error' => 'API请求失败', 'code' => $httpCode];
    }

    return json_decode($response, true);
}

/**
 * 从AI响应中提取JSON
 */
function extractJSON($text) {
    // 尝试匹配```json...```格式
    if (preg_match('/```json\s*([\s\S]*?)\s*```/', $text, $matches)) {
        return $matches[1];
    }
    // 尝试匹配[...]或{...}
    if (preg_match('/(\[[\s\S]*\]|\{[\s\S]*\})/', $text, $matches)) {
        return $matches[1];
    }
    return $text;
}

// 获取请求参数
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? '';
$city = $input['city'] ?? $_GET['city'] ?? '';

if (empty($city)) {
    echo json_encode(['error' => '请提供城市名称']);
    exit;
}

$response = ['city' => $city, 'success' => false];

switch ($action) {
    case 'attractions':
        // 生成景点推荐
        $prompt = "请为{$city}推荐6个最值得游玩的热门景点。
要求：
1. 直接返回JSON数组，不要任何其他文字说明
2. 每个景点包含以下字段：
   - name: 景点名称
   - desc: 一句话描述（20-40字）
   - rating: 评分（4.0-5.0之间，保留1位小数）
   - tags: 两个标签的数组
3. 按热门程度排序

只返回JSON数组，格式示例：
[{\"name\":\"景点名\",\"desc\":\"描述\",\"rating\":4.5,\"tags\":[\"标签1\",\"标签2\"]}]";

        $result = callSparkAI($prompt);
        
        if (isset($result['choices'][0]['message']['content'])) {
            $content = $result['choices'][0]['message']['content'];
            $jsonStr = extractJSON($content);
            $attractions = json_decode($jsonStr, true);
            
            if ($attractions && is_array($attractions)) {
                // 添加默认图片
                $defaultImages = [
                    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
                    'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&q=80',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80'
                ];
                
                foreach ($attractions as $i => &$attr) {
                    $attr['image'] = $defaultImages[$i % count($defaultImages)];
                }
                
                $response['success'] = true;
                $response['attractions'] = $attractions;
            } else {
                $response['error'] = '解析景点数据失败';
                $response['raw'] = $content;
            }
        } else {
            $response['error'] = '获取景点推荐失败';
            $response['raw'] = $result;
        }
        break;

    case 'plan':
        // 生成旅行计划
        $prompt = "请为{$city}制定一个详细的旅行计划。
要求：
1. 直接返回JSON对象，不要任何其他文字说明
2. 根据景点数量合理安排天数（2-4天）
3. JSON格式如下：
{
  \"title\": \"{$city}X日游\",
  \"days\": [
    {\"time\": \"第一天 上午\", \"title\": \"景点名称\", \"desc\": \"游玩建议（30字左右）\"},
    {\"time\": \"第一天 下午\", \"title\": \"景点名称\", \"desc\": \"游玩建议\"}
  ]
}

只返回JSON对象，不要其他内容。";

        $result = callSparkAI($prompt);
        
        if (isset($result['choices'][0]['message']['content'])) {
            $content = $result['choices'][0]['message']['content'];
            $jsonStr = extractJSON($content);
            $plan = json_decode($jsonStr, true);
            
            if ($plan && isset($plan['title']) && isset($plan['days'])) {
                $response['success'] = true;
                $response['plan'] = $plan;
            } else {
                $response['error'] = '解析旅行计划失败';
                $response['raw'] = $content;
            }
        } else {
            $response['error'] = '获取旅行计划失败';
            $response['raw'] = $result;
        }
        break;

    case 'clothing':
        // 生成穿衣建议
        $weather = $input['weather'] ?? '';
        $temp = $input['temp'] ?? '';
        
        $prompt = "当前{$city}天气：{$weather}，温度{$temp}°C。请给出简洁的穿衣建议，50字以内，直接说建议内容，不要开头语。";
        
        $result = callSparkAI($prompt, 200);
        
        if (isset($result['choices'][0]['message']['content'])) {
            $response['success'] = true;
            $response['advice'] = $result['choices'][0]['message']['content'];
        }
        break;

    default:
        $response['error'] = '未知操作类型';
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);

